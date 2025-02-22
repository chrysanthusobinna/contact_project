> [!NOTE]  
> Return back to the [README.md](README.md) file.

# Deploying THE Contact API to AWS EC2

## Step 1: Set Up an AWS EC2 Instance

1. **Log in to AWS Console**: Go to the [AWS Management Console](https://aws.amazon.com/console/) and log in with your credentials.

2. **Launch an EC2 Instance**:

   - Navigate to the EC2 Dashboard.
   - Click on **"Launch Instance"**.
   - Choose **"Ubuntu Server 24.04 LTS (HVM)"** as the Amazon Machine Image (AMI).
   - Select an instance type, preferably **t2.micro** (eligible for the free tier).
   - Configure Security Group:
     - Allow **SSH traffic** from your IP.
     - Allow **HTTPS traffic** from the internet.
     - Allow **HTTP traffic** from the internet.
   - Create a new key pair or use an existing one, download the `.pem` file, and store it securely.

3. **Connect to Your EC2 Instance**:

   - In the EC2 Dashboard, find your instance.
   - Select the instance by clicking the checkbox next to it.
   - Click the **Connect** button at the top.
   - In the **Connect to instance** page, select the **EC2 Instance Connect** tab.
   - Click the **Connect** button at the bottom.
   - A new browser tab will open with a terminal session connected to your EC2 instance.

---

## Step 2: Install Required Software on EC2

1. **Update the Package List**:

   ```bash
   sudo apt-get update
   ```

2. **Install Python and Pip**:

   ```bash
   sudo apt-get install python3 python3-pip -y
   ```

3. **Install Git**:

   ```bash
   sudo apt-get install git -y
   ```

4. **Install Virtualenv**:

   ```bash
   sudo apt install python3-venv -y
   ```

---

## Step 3: Clone Your Repository

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/chrysanthusobinna/contact_project.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd contact_project
   ```

---

## Step 4: Set Up a Virtual Environment (Recommended)

1. **Create a Virtual Environment**:

   ```bash
   python3 -m venv venv
   ```

2. **Activate the Virtual Environment**:

   ```bash
   source venv/bin/activate
   ```

---

## Step 5: Install Dependencies

1. **Install Dependencies from `requirements.txt`**:

   ```bash
   pip install -r contacts_api/requirements.txt
   ```

---

## Step 6: Configure the API

1. **Navigate to the API Directory**:

   ```bash
   cd contacts_api
   ```

2. **Run Migrations**:

   ```bash
   python3 manage.py migrate
   ```

---

## Step 7: Set Up a Web Server

1. **Install Nginx**:

   ```bash
   sudo apt-get install nginx -y
   ```

2. **Configure Nginx**:

   - Edit the Nginx configuration file:
     ```bash
     sudo nano /etc/nginx/sites-available/contact_api
     ```
   - Copy your **EC2 public IP** from the AWS Management Console.
   - Add the following configuration:
     ```nginx
     server {
         listen 80;
         server_name your-ec2-public-ip;

         location / {
             proxy_pass http://127.0.0.1:8000;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         }
     }
     ```

3. **Enable the Nginx Configuration**:

   ```bash
   sudo ln -s /etc/nginx/sites-available/contact_api /etc/nginx/sites-enabled/
   ```

4. **Test the Nginx Configuration**:

   ```bash
   sudo nginx -t
   ```

5. **Restart Nginx**:

   ```bash
   sudo systemctl restart nginx
   ```

---

## Step 8: Run the API

1. **Start the API using Gunicorn**:
   
   ```bash
   gunicorn --workers 3 --bind 0.0.0.0:8000 contacts_api.wsgi:application
   ```

---

## Step 9: Test the API

1. **Access Your API**:
   
   - Open a web browser and navigate to `http://your-ec2-public-ip`.
   - If you see a ** Error Page: Not Found (404)**, your API is working correctly.

---
 