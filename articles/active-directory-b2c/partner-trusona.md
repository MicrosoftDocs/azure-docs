# Tutorial for integrating Trusona and Azure Active Directory B2C

In this tutorial, you will learn how to add Trusona as an Identity Provider on Azure AD B2C to enable passwordless authentication.

## Onboarding with Trusona

1. Fill-out the [form](https://www.trusona.com/aadb2c) to create a Trusona account and get started. 

2. Download the Trusona mobile app from the App store. Install the app and register your email.

3. Verify your email through the secure magic link sent by the software.  

4. Go to [Trusona Developer’s dashboard](dashboard.trusona.com) for self-service.

5. Select **I’m Ready** and authenticate yourself with your Trusona app.

6. From the left navigation panel, choose **OIDC Integrations**.

7. Select **Create OpenID Connect Integration**.

8. Provide a **Name** of your choice and use the domain information previously provided (for example, Contoso) in the **Client Redirect Host field**.  

> [!NOTE]
> Azure Active Directory’s initial domain name is used as the Client Redirect host.

9. Follow the instructions mentioned in the [Trusona integration guide](https://docs.trusona.com/integrations/aad-b2c-integration/). Use the initial domain name (for example, Contoso) referred in the previous section when prompted.  

## Integrating Trusona with Azure AD B2C

### Creating an Azure Active Directory B2C tenant

> [!NOTE]
> If you already have a B2C tenant set-up, skip these steps.  

1. Select **Dashboard** from the sidebar.

2. In the search bar, enter **Azure Active Directory B2C**.  

3. Select **Create a new Azure AD B2C Tenant** from the dropdown.  

4. Enter **Organization name** and **Initial Domain Name**.

5. Select the **Create** button.

> [!NOTE]
> It may take a few minutes for the tenant to be created.

### Adding a new Identity provider

1. Navigate to **Dashboard** > **Azure AD B2C** > **Identity providers**

2. Select **Identity providers**

3. Select **Add**

### Configuring an Identity provider  

1. Select **Identity provider type** > **OpenID Connect (Preview)**

2. Fill-out the form below to set up the identity provider  

| Property | Value  |
| :--- | :--- |
| Metadata URL | `https://gateway.trusona.net/oidc/.well-known/openid-configuration`|
| Client ID | Will be emailed to you from Trusona |
| Scope | OpenID profile email |
| Response type | Id_token |
| Response mode  | Form_post |

3. Select **Ok**.  

4. Select **Map this identity provider’s claims**.  

5. Fill-out the form below to map the identity provider  

| Property | Value  |
| :--- | :--- |
| UserID | Sub  |
| Display name | nickname |
| Given name | given_name |
| Surname | Family_name |
| Response mode | email |

6. Select **Ok** to complete the setup for your new OIDC Identity Provider.

### Creating a user flow policy

1. You should now see Trusona as a **new OpenID Connect Identity Provider** listed within your B2C Identity Providers.

2. Select **User flows (policies)** from the left navigation panel.

3. Select **Add** > **New user flow** > **Sign up and sign in**

### Configuring the Policy

1. Name your policy

2. Select your newly created **Trusona Identity Provider**.

3. As Trusona is inherently multi-factor, it's best to leave multi-factor authentication disabled.

4. Select **Create**.

5. Under **User Attributes and Claims**, choose **Show more**. In the form, select at least one attribute that you specified during the setup of your Identity Provider in earlier section.

6. Select **OK**.  

### Testing the Policy

1. Select your newly created policy

2. Select **Run user flow**

3. In the form, enter the Replying URL

4. Then select **Run user flow** button and you should be redirected to the Trusona OIDC gateway. On the Trusona gateway, scan the displayed Secure QR code with the Trusona app or with a custom app using the Trusona mobile SDK.

5. After scanning the Secure QR code, you should be redirected to the Reply URL you defined in step 3.

## Additional resources  

1. Refer to GitHub for code samples

2. [Custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

3. [Get started with custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
