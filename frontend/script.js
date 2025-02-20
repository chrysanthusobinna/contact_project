
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

        
    // Document ready 
    $(function (){
        
        // IF USER IS LOGGED IN
        isUserLoggedIn().then((loggedIn) => {
            if(loggedIn){
                // User is logged in
                $('#loginNav, #registerNav').addClass('d-none');
                $('#logoutNav').removeClass('d-none');

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
                    let errors = xhr.responseJSON;
                    let errorMessage = '<ul>';
                    for (let key in errors){
                        errorMessage += `<li><strong>${key}:</strong> ${errors[key]}</li>`;
                    }
                    errorMessage += '</ul>';
                    
                    $('#registerErrorAlert')
                        .removeClass('d-none')   
                        .html(errorMessage);      
                }
                
                
            });
        });

 
        //USER LOGIN
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

                        $('#loginNav, #registerNav').addClass('d-none');
                        $('#logoutNav').removeClass('d-none');

                        loadContacts(); // Load contacts dynamically after login
                },
                error: function(xhr){
                    let errorMessage = 'Login failed! Incorrect username or password.';
                    $('#loginErrorAlert')
                        .removeClass('d-none')
                        .text(errorMessage);
                }
            });
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
                    let errors = xhr.responseJSON;
                    let errorMessage = '<ul>';
                    for (let key in errors){
                        errorMessage += `<li><strong>${key}:</strong> ${errors[key]}</li>`;
                    }
                    errorMessage += '</ul>';
    
                    $('#contactErrorAlert')
                        .removeClass('d-none')
                        .html(errorMessage);
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
                let errorMessage = xhr.responseJSON.detail || 'Failed to load contact details.';
                $('#mainAlert')
                    .removeClass('d-none alert-success')
                    .addClass('alert-danger')
                    .find('#alertMessage').text(errorMessage);
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
                let errorMessage = xhr.responseJSON.detail || 'Failed to delete contact.';
                $('#deleteErrorAlert')
                    .removeClass('d-none')
                    .text(errorMessage);
            }
        });
    });

});
