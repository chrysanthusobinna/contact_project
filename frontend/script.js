
 
        // HANDLE CONNECTION API ERRORS
        function handleApiError(xhr){
            $('.modal.show').modal('hide');

            let errorMessage;

            if(xhr.status === 0){
                errorMessage = 'Connection failed. Please check your internet or API connection.';
            } else if(xhr.responseJSON && xhr.responseJSON.detail) {
                errorMessage = xhr.responseJSON.detail;
            } else {
                errorMessage = 'An unexpected error occurred. Please try again later.';
            }

            $('#mainAlert')
                .removeClass('d-none alert-success alert-info')
                .addClass('alert-danger')
                .find('#alertMessage').text(errorMessage);
        }

 
        // FUNCTION LOAD CONTACTS
        function loadContacts(){
            $.ajax({
                url: API_BASE_URL + '/contacts/',
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('access')},
                success: function(data){
                    $('#contactsBody').empty();
                    data.forEach(function(contact){
                        $('#contactsBody').append(`
                            <tr>
                                <td>${contact.name}</td>
                                <td>${contact.address}</td>
                                <td>${contact.phone_number}</td>
                                <td>
                                    <button class="btn btn-sm btn-info edit" data-id="${contact.id}">Edit</button>
                                    <button class="btn btn-sm btn-danger delete" data-id="${contact.id}">Delete</button>
                                </td>
                            </tr>
                        `);
                    });
                    $('#contactsSection').show();
                },
                error: function(){
                    $('#welcomeUser').text('');
                }
            });
        }

        //CHECK IF USER IS LOGGED IN
        function isUserLoggedIn(){
            return new Promise((resolve) => {
                const token = localStorage.getItem('access');
                if(token){
                    $.ajax({
                        url: API_BASE_URL + '/token/verify/',
                        method: 'POST',
                        data: JSON.stringify({ token: token }),
                        contentType: 'application/json',
                        success: function(){
                            resolve(true);  
                        },
                        error: function(){
                            resolve(false);  
                        }
                    });
                } else {
                    resolve(false);  
                }
            });
        }


    //LOAD USER DETAILS
    function loadUserDetails(){
        $.ajax({
            url: API_BASE_URL + '/user-details/',
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('access')},
            success: function(user){
                $('#welcomeUser').text(`Welcome, ${user.username}!`);
            },
            error: function(){
                $('#welcomeUser').text('');
            }
        });
    }
        


    // DOCUMENT READY 
    $(function (){
        
        // IF USER IS LOGGED IN
        isUserLoggedIn().then((loggedIn) => {
            if(loggedIn){
                // User is logged in
                 $('#loginNav, #registerNav, #GuestSection').addClass('d-none');
                $('#logoutNav').removeClass('d-none');

                loadUserDetails();
                loadContacts();
            } else {
                // User is not logged in
                $('#loginNav, #registerNav').removeClass('d-none');
                $('#logoutNav').addClass('d-none');
                $('#contactsSection').hide();
            }
        });

        
        // USER REGISTER
        $('#registerBtn').click(function(e){
            e.preventDefault();
            $.ajax({
                url: API_BASE_URL + '/register/',
                method: 'POST',
                data: JSON.stringify({
                    username: $('#registerUsername').val(),
                    email: $('#registerEmail').val(),
                    password: $('#registerPassword').val()
                }),
                contentType: 'application/json',
                success: function(response){
                    $('#registerModal').modal('hide');
                    $('#mainAlert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .find('#alertMessage').text('Registration successful! Please login.');
                },
                error: function(xhr){
                    if(xhr.status === 400){
                        let errors = xhr.responseJSON;
                        let errorMessage = '<ul>';
                        for (let key in errors){
                            errorMessage += `<li><strong>${key}:</strong> ${errors[key]}</li>`;
                        }
                        errorMessage += '</ul>';
                        
                        $('#registerErrorAlert')
                            .removeClass('d-none')   
                            .html(errorMessage);
                    } else {
                        handleApiError(xhr); 
                    }
                }
            });
        });

 
        // USER LOGIN
        $('#loginBtn').click(function(e){
            e.preventDefault();
            $.ajax({
                url: API_BASE_URL + '/login/',
                method: 'POST',
                data: JSON.stringify({
                    username: $('#loginUsername').val(),
                    password: $('#loginPassword').val()
                }),
                contentType: 'application/json',
                success: function(response){
                    localStorage.setItem('access', response.access);
                    localStorage.setItem('refresh', response.refresh);
                    
                    $('#loginModal').modal('hide');
                    
                    $('#mainAlert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .find('#alertMessage').text('Login successful!');

                    $('#loginNav, #registerNav, #GuestSection').addClass('d-none');
                    $('#logoutNav').removeClass('d-none');

                    loadUserDetails();
                    loadContacts();  
                },
                error: function(xhr){
                    if(xhr.status === 401){
                        let errorMessage = 'Login failed! Incorrect username or password.';
                        $('#loginErrorAlert')
                            .removeClass('d-none')
                            .text(errorMessage);
                    } else {
                        handleApiError(xhr); 
                    }
                }
            });
        });


 
        // CONFIRM LOGOUT
        $('#confirmLogout').click(function(){
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            
            $('#logoutModal').modal('hide');
            
            $('#loginNav, #registerNav, #GuestSection').removeClass('d-none');
            $('#logoutNav').addClass('d-none');
            $('#contactsSection').hide();
    
            $('#mainAlert')
                .removeClass('d-none alert-danger')
                .addClass('alert-success')
                .find('#alertMessage').text('Logged out successfully.');
        });

        
        //SAVE CONTACT
        $('#saveContact').click(function(e){
            e.preventDefault();
    
            const contactId = $('#contactId').val();
            const method = contactId ? 'PUT' : 'POST';
            const url = contactId ? `${API_BASE_URL}/contacts/${contactId}/edit/` : API_BASE_URL + '/contacts/create/';
    
            $.ajax({
                url: url,
                method: method,
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('access')},
                data: JSON.stringify({
                    name: $('#contactName').val(),
                    address: $('#contactAddress').val(),
                    phone_number: $('#contactPhone').val()
                }),
                contentType: 'application/json',
                success: function(response){
                    $('#contactModal').modal('hide');
    
                    $('#mainAlert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .find('#alertMessage').text('Contact saved successfully!');
    
                    loadContacts();  
                },
                error: function(xhr){
                    if(xhr.status === 400){
                        let errors = xhr.responseJSON;
                        let errorMessage = '<ul>';
                        for (let key in errors){
                            errorMessage += `<li><strong>${key}:</strong> ${errors[key]}</li>`;
                        }
                        errorMessage += '</ul>';
        
                        $('#contactErrorAlert')
                            .removeClass('d-none')
                            .html(errorMessage);
                    } else {
                        handleApiError(xhr);  
                    }
                }
            });
        });
    
        $('#addContact').click(function(){
            $('#contactId').val('');
            $('#contactName').val('');
            $('#contactAddress').val('');
            $('#contactPhone').val('');
            $('#contactErrorAlert').addClass('d-none'); // hide previous errors
            $('#contactModal').modal('show');
        });
   

    // Edit CONTACT
    $('#contactsBody').on('click', '.edit', function(){
        const id = $(this).data('id');
    
        $('#contactErrorAlert').addClass('d-none');
    
        $.ajax({
            url: `${API_BASE_URL}/contacts/${id}/`,
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('access')},
            success: function(contact){
                $('#contactId').val(contact.id);
                $('#contactName').val(contact.name);
                $('#contactAddress').val(contact.address);
                $('#contactPhone').val(contact.phone_number);
                
                $('#contactModal').modal('show');
            },
            error: function(xhr){
                handleApiError(xhr);  
            }
        });
    });



    // DELETE CONTACT
    let contactIdToDelete; 

    // Show Delete Modal on Delete button click
    $('#contactsBody').on('click', '.delete', function(){
        contactIdToDelete = $(this).data('id');
        $('#deleteErrorAlert').addClass('d-none');  
        $('#deleteContactModal').modal('show');
    });

    // Confirm Deletion
    $('#confirmDelete').click(function(){
        $.ajax({
            url: `${API_BASE_URL}/contacts/${contactIdToDelete}/delete/`,
            method: 'DELETE',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('access')},
            success: function(){
                $('#deleteContactModal').modal('hide');

                $('#mainAlert')
                    .removeClass('d-none alert-danger')
                    .addClass('alert-success')
                    .find('#alertMessage').text('Contact deleted successfully!');

                loadContacts();
            },
            error: function(xhr){
                handleApiError(xhr); 
            }
        });
    });

});
