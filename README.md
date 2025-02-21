### **Contact API CRUD Routes**
| **Method** | **Endpoint** | **Functionality** |
|------------|--------------|-------------------|
| `POST`     | `/api/register/` | Register new user |
| `POST`     | `/api/login/` | User login (obtain token) |
| `POST`     | `/api/logout/` | Logout user (blacklist refresh token) |
| `GET`      | `/api/user-details/` | Get details of logged-in user (authentication required) |
| `POST`     | `/api/token/refresh/` | Refresh access token |
| `POST`     | `/api/token/verify/` | Verify access token |
| `GET`      | `/api/contacts/` | Get all contacts (authentication required) |
| `POST`     | `/api/contacts/create/` | Create a contact (authentication required) |
| `GET`      | `/api/contacts/<id>/` | Get single contact by ID (authentication required) |
| `PUT`      | `/api/contacts/<id>/edit/` | Update contact by ID (authentication required) |
| `DELETE`   | `/api/contacts/<id>/delete/` | Delete contact by ID (authentication required) |

