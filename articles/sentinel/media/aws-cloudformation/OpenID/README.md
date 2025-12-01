### 3. Create the CloudFormation stack

1. Sign in to the **AWS Management Console**.
2. In the search bar, type **CloudFormation** and open the **CloudFormation** service.
![image1](images/Picture1.png)

3. Select **Create stack** → **With new resources (standard)**.
![image2](images/Picture2.png)

---

#### 3.1 Step 1 – Specify template

1. Under **Prepare template**, select **Choose an existing template**.
2. Under **Template source**, select **Upload a template file**.
3. Click **Choose file** and upload the provided template file.
4. Click **Next**.
![image3](images/Picture3.png)
---

#### 3.2 Step 2 – Specify stack details

1. **Stack name**: Enter a name for the stack (for example, `OpenID-Authentication`).
2. Leave all other parameters at their **default values**, unless your environment requires changes.
3. Click **Next**.
![image4](images/Picture4.png)
---

#### 3.3 Step 3 – Configure stack options

1. Leave the default options unchanged.
2. In the **Capabilities** section, acknowledge that AWS CloudFormation might create IAM resources with custom names by selecting the required checkbox.
3. Click **Next**.
![image5](images/Picture5.png)
---

#### 3.4 Step 4 – Review

1. Review all settings and confirm that all required fields are correctly populated.
2. Click **Submit** to create the stack.
![image6](images/Picture6.png)


After submission:

1. Go to **CloudFormation → Stacks → Events** and monitor the stack creation progress.
2. When the status shows **CREATE_COMPLETE**, verify in the **Stacks** list that the stack has been successfully created.
![image7](images/Picture7.png)
