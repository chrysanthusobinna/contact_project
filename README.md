READMEFILE
 
### **Contact API CRUD  Routes**
| **Method** | **Endpoint** | **Functionality** |
|-----------|------------|----------------|
| `POST` | `/api/register/` | Register new user |
| `POST` | `/api/login/` | User login (get token) |
| `POST` | `/api/logout/` | Logout user (blacklist refresh token) |
| `POST` | `/api/token/refresh/` | Refresh access token |
| `GET` | `/api/contacts/` | Get all contacts (authenticated required) |
| `POST` | `/api/contacts/create/` | Create contact (authenticated required)|
| `GET` | `/api/contacts/<id>/` | Get single contact using id (authenticated required)|
| `PUT` | `/api/contacts/<id>/edit/` | Update contact (authenticated required)|
| `DELETE` | `/api/contacts/<id>/delete/` | Delete contact (authenticated required)|

---