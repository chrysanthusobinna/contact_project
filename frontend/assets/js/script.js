
 
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


        // FUNCTION TO REPLACE UNDERSCORES WITH SPACES, CAPITALIZE WORDS
        function formatErrorKey(key) {
            return key.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
        }

 
        // FUNCTION LOAD CONTACTS
        function loadContacts(){
            $.ajax({
                url: API_BASE_URL + '/contacts/',
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('access')},
                success: function(data){
                    if($.fn.DataTable.isDataTable('#contactsTable')){
                        $('#contactsTable').DataTable().destroy();
                    }

                    $('#contactsBody').empty();

                    data.forEach(function(contact){
                        $('#contactsBody').append(`
                            <tr>
                                <td>${contact.name}</td>
                                <td>${contact.address}</td>
                                <td>${contact.phone_number}</td>
                                <td class="text-center text-nowrap">
                                    <div class="d-flex gap-2 justify-content-center">
                                        <button class="btn btn-sm btn-outline-info edit" data-id="${contact.id}">
                                            <i class="fa-solid fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete" data-id="${contact.id}">
                                            <i class="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `);
                    });
                                    

                    // Reinitialize DataTable
                    $('#contactsTable').DataTable();
                    
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
                        error: function(xhr){
                            if(xhr.status === 0){
                                handleApiError(xhr);    
                            }
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
                $('#loginNav, #registerNav, #GuestSection').removeClass('d-none');
                $('#logoutNav').addClass('d-none');
                $('#contactsSection').hide();
            }
        });


        // ON CLICK REGISTER NAV BUTTON
        $('#registerNav').on('click', function() {
            $('#registerErrorAlert').addClass('d-none').text('');
            $('#registerUsername').val('');
            $('#registerEmail').val('');
            $('#registerPassword').val('');
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
                    $('#mainAlert').removeClass('d-none alert-danger').addClass('alert-success').find('#alertMessage').text('Registration successful! Please login.');
                },
                error: function(xhr){
                    if(xhr.status === 0) {
                        handleApiError(xhr);
                    } else {
                        let errors = xhr.responseJSON;
                        let errorMessage = '<ul>';
                        for (let key in errors){
                            let formattedKey = formatErrorKey(key); 
                            errorMessage += `<li><strong>${formattedKey}:</strong> ${errors[key]}</li>`;
                        }
                        errorMessage += '</ul>';                        
                        
                        $('#registerErrorAlert').removeClass('d-none').html(errorMessage);
                    }
                }
            });
        });

 
        // ON CLICK LOGIN NAV BUTTON
        $('#loginNav').on('click', function() {
            $('#loginErrorAlert').addClass('d-none').text('');
            $('#loginUsername').val('');
            $('#loginPassword').val('');
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
                    if(xhr.status === 0) {
                        handleApiError(xhr); 
                    } else {
                        let errorMessage = 'Login failed! Incorrect username or password.';
                        $('#loginErrorAlert').removeClass('d-none').text(errorMessage);
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
                    if(xhr.status === 0) {
                        handleApiError(xhr); 
                    } else {
                        let errors = xhr.responseJSON;
                        let errorMessage = '<ul>';
                        for (let key in errors){
                            let formattedKey = formatErrorKey(key); 
                            errorMessage += `<li><strong>${formattedKey}:</strong> ${errors[key]}</li>`;
                        }
                        errorMessage += '</ul>';
        
                        $('#contactErrorAlert')
                            .removeClass('d-none')
                            .html(errorMessage);
                    }
                }
            });
        });
    
        $('#addContact').click(function(){
            $('#contactModalTittle').text('Add Contact');
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
                $('#contactModalTittle').text('Edit Contact');
                $('#contactId').val(contact.id);
                $('#contactName').val(contact.name);
                $('#contactAddress').val(contact.address);
                $('#contactPhone').val(contact.phone_number);
                
                $('#contactModal').modal('show');
            },
            error: function(xhr){
                if(xhr.status === 0) {
                    handleApiError(xhr); 
                }
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
                if(xhr.status === 0) {
                    handleApiError(xhr); 
                }
            }
        });
    });

});
