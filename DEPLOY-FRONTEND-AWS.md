> [!NOTE]  
> Return back to the [README.md](README.md) file.

# Deploying The Frontend Client to AWS S3

This guide will help you deploy the static HTML/jQuery frontend to AWS S3 and connect it to your API on AWS EC2.

## Step 1: Prepare Your Frontend Project

**Clone Your Repository**:

```bash
git clone https://github.com/chrysanthusobinna/contact_project.git
```

**Navigate to Your Frontend Directory**:

```bash
cd contact_project/frontend
```

---

## Step 2: Update the API URL in Frontend

Update the API URL in your JavaScript configuration file to point to your deployed API on EC2.

Open `frontend/assets/js/config.js` and change:

```javascript
const API_BASE_URL = "http://your-ec2-public-ip/api";
```

Replace `your-ec2-public-ip` with your actual EC2 public IP address.

Save the file after updating.

---

## Step 3: Create an AWS S3 Bucket

1. Log in to your [AWS Management Console](https://aws.amazon.com/console/).

2. Navigate to **S3**.

3. Click on **"Create bucket"**.

4. Enter a unique bucket name (e.g., `my-contact-app-client`).

5. Click **"Create bucket"**.

---

## Step 4: Upload Your Frontend Files to S3

1. Open your newly created bucket.

2. Click **"Upload"**.

3. upload the index.html file and the assets folder inside the `frontend` folder.

4. Click **"Upload"**.

---

## Step 5: Configure S3 Bucket for Static Website Hosting

**Enable Static Website Hosting**:

1. Inside your bucket, click **"Properties"**.

2. Scroll to **"Static website hosting"** and click **"Edit"**.

3. Select **"Enable"**.

4. Set **Index document** to `index.html`.

5. Click **"Save changes"**.

**Allow Public Access**:

1. Click the **"Permissions"** tab.

2. Edit **"Block public access"**.

3. Uncheck **"Block all public access"**.

4. Click **"Save changes"** and type **"confirm"**.

**Add Bucket Policy for Public Access**:

1. In **Permissions**, scroll to **"Bucket policy"**.

2. Click **"Edit"** and paste this policy (replace `your-bucket-name` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::your-bucket-name/*"]
    }
  ]
}
```

3. Click **"Save changes"**.

---

## Step 6: Access Your Deployed Frontend Website

**Find Your Website URL**:

- Go to **"Properties"** → **"Static website hosting"**.
- You will see your bucket website endpoint (e.g., `http://your-bucket-name.s3-website-region.amazonaws.com`).

**Open Your Website**:

- Open a browser and visit your S3 website URL.
- Your frontend should load and be able to consume the API hosted on EC2.

---
 