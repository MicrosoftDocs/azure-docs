---
title: Adding Custom verified domains for Email Communication Services
titleSuffix: An Azure Communication Services quick start guide
description: Learn about adding Custom domains for Email Communication Services.
author: bashan
manager: shanhen
services: azure-communication-services

ms.author: bashan
ms.date: 02/15/2022
ms.topic: overview
ms.service: azure-communication-services
ms.custom: private_preview
---
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/Email/create-email-communication-resource.md)

## Provision Custom Domain


### Verify Custom Domain

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Setup Custom Domain.   
    - (Option 1) Click the **Setup** button under **Setup a custom domain**. Move to the next step.
      ![image](https://user-images.githubusercontent.com/35741731/162817778-60fb1e0d-ede3-4877-8490-ce3151af7444.png)

    - (Option 2) Click **Provision Domains** on the left navigation panel.
   ![image](https://user-images.githubusercontent.com/35741731/162823276-9edc6029-45c1-42f3-952a-1ac13aa3f1c5.png)

    - Click **Add domain** on the upper navigation bar.
    - Select **Custom domain** from the dropdown.
3. You will be navigating to "Add a custom Domain". 
4. Enter  your "Domain Name" and re enter domain name
5. Click **Confirm**.
   ![image](https://user-images.githubusercontent.com/35741731/162818638-aa307cde-b6a4-4069-896a-7f69702b08c0.png)
6. Please ensure that domain name is not misspelled or click edit to correct the domain name and confirm.
7. Click **Add**.![image](https://user-images.githubusercontent.com/35741731/162819927-d12edb4a-de94-417b-9cfb-10b41ce960bb.png)

8. This will create custom domain configuation for your domain ![image](https://user-images.githubusercontent.com/35741731/162822035-08bba198-68ac-47dc-a703-55a810538a5d.png)

9. You can verify the ownership of the domain by clicking **Verify Domain** ![image](https://user-images.githubusercontent.com/35741731/162819470-60f6178e-a009-43d2-8b44-4d566260f70e.png).

10. If you would like to resume the verification later you can click **Close** and resume the verification from **Provision Domains** by clicking **Configure** link ![image](https://user-images.githubusercontent.com/35741731/162824226-6170beb5-6ace-4edc-9138-d7c76edcab5a.png)
11. Clicking **Verify Domain** or **Configure** will navigate to "Verify Domain via TXT record" to follow. ![image](https://user-images.githubusercontent.com/35741731/162831193-1bc93a0b-9170-4c8b-866c-54848584d658.png)
12.You need add the above TXT record to your domain's registrar or DNS hosting provider. Click **Next** once you've completed this step. ![image](https://user-images.githubusercontent.com/35741731/162825103-b6ea623d-a4c6-4190-a928-2ed6a2b62bfa.png)
13. Verify that TXT record is created successfully in your DNS and Click **Done**. 
14. DNS changes will take up to 15 to 30 minutes.  Click **Close**. ![image](https://user-images.githubusercontent.com/35741731/162826317-9e377d65-7173-4eaf-b809-896f97cfc414.png)
15. Once your domain is verified, you can setup your SPF, DKIM, and DMARC records to authenticate your domains.   ![image](https://user-images.githubusercontent.com/35741731/162826515-4f10efb2-adef-4fc1-99e6-574b6a933634.png)


### Configure Sender Authentication for  Custom Domain
1. Navigate to  **Provision Domains** and confirm that  **Domain Status** is in "Verified" state. 
2. You can setup SPF and DKIM  by clicking **Configure**. You need add the following TXT record and CNAME records to your domain's registrar or DNS hosting provider. Click **Next** once you've completed this step. 

![image](https://user-images.githubusercontent.com/35741731/162828137-cbc665b8-8c45-44cc-8efc-9e6e7502a8b2.png)

![image](https://user-images.githubusercontent.com/35741731/162828272-54cfb325-d378-4701-8046-48b8f7266590.png)

![image](https://user-images.githubusercontent.com/35741731/162828352-800d0ce6-8121-4f07-8adc-60f5158b1b35.png)

3. Verify that TXT and CNAME records are created successfully in your DNS and Click **Done**.  
![image](https://user-images.githubusercontent.com/35741731/162828759-6a333949-dd51-4fc8-b4de-d7cf23a0a4e0.png)

4. DNS changes will take up to 15 to 30 minutes.  Click **Close**.![image](https://user-images.githubusercontent.com/35741731/162829184-593273f7-cc43-42ce-8bd6-f2e6f17baa1d.png)
5. Wait for Verification to complete. You can check the Verification Status from **Provision Domains** page. ![image](https://user-images.githubusercontent.com/35741731/162829426-11edc332-f4ca-4ba2-82bb-b2cc30be78f7.png)
6. Once your sender authentication configurations are successfully verified, your email domain will be ready to send emails using custom domain.


![image](https://user-images.githubusercontent.com/35741731/162830872-70c3c490-3f46-4ae2-b75f-f2dffe41953d.png)

## Changing MailFrom and FROM display name for Azure Managed Domain

When azure manged domain is provisioned to send mail, it has default Mail From address as donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net and the FROM display name would be the same. You will able to configre and change the MailFrom address and FROM displayname to more user friendly value.

1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Click **Provision Domains** on the left navigation panel. You will be see list of provisioned domains.
3. Click on the Custom Domain name that you would like to update.
![image](https://user-images.githubusercontent.com/35741731/163034155-b7b28213-9fd2-41e9-9b6b-b2e3d61772e5.png)
4. The navigation lands in Domain Overview page where you will able to see Mailfrom and From attributes.

![image](https://user-images.githubusercontent.com/35741731/163034241-9c322cb4-0af6-4864-a4ed-8bbc7fe7487b.png)

5. Click on edit link on MailFrom 

![image](https://user-images.githubusercontent.com/35741731/163034285-d480e6a7-2c16-4959-938a-4136cce24df7.png)

6. You will able to modify the Display Name and MailFrom address. 

![image](https://user-images.githubusercontent.com/35741731/163035172-cba4c261-a8cd-4579-9b88-b7e1e7380e30.png)

7. Click **Save**. You will see the updated values in the overview page. 

![image](https://user-images.githubusercontent.com/35741731/163035291-f303532b-3eac-470a-9b31-aadb50aa6ec4.png)

**Your email domain is now ready to send emails.**

## Next steps

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)

> [Best Practices for Sender Authentication Support in Azure Communication Services Email](./email-authentication-bestpractice.md)


The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../Email/sdk-features.md)
