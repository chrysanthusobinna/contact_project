
        // FUNCTION LOAD CONTACTS
        function loadContacts(){
            $.ajax({
                url: 'http://127.0.0.1:8000/api/contacts/',
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

    // Document ready 
    $(function (){

        // CALL FUNCTION LOAD CONTACT
        loadContacts();
        
        // USER REGISTER
        $('#registerBtn').click(function(e){
            e.preventDefault();
            $.ajax({
                url: 'http://127.0.0.1:8000/api/register/',
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
                url: 'http://127.0.0.1:8000/api/login/',
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
            const url = contactId ? `http://127.0.0.1:8000/api/contacts/${contactId}/edit/` : 'http://127.0.0.1:8000/api/contacts/create/';
    
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
    
        // Show modal for adding new contact
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
            url: `http://127.0.0.1:8000/api/contacts/${id}/`,
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
            url: `http://127.0.0.1:8000/api/contacts/${contactIdToDelete}/delete/`,
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
