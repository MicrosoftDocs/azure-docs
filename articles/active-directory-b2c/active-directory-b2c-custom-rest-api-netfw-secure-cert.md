---
title: Secure your RESTful service by using client certificates in Azure Active Directory B2C | Microsoft Docs
description: Secure your custom REST API claims exchanges in your Azure AD B2C by using client certificates
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/25/2017
ms.author: marsma
ms.subservice: B2C
---

# Secure your RESTful service by using client certificates

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In a related article, you [create a RESTful service](active-directory-b2c-custom-rest-api-netfw.md) that interacts with Azure Active Directory B2C (Azure AD B2C).

In this article, you learn how to restrict access to your Azure web app (RESTful API) by using a client certificate. This mechanism is called TLS mutual authentication, or *client certificate authentication*. Only services that have proper certificates, such as Azure AD B2C, can access your service.

>[!NOTE]
>You can also secure your RESTful service by using [HTTP basic authentication](active-directory-b2c-custom-rest-api-netfw-secure-basic.md). However, HTTP basic authentication is considered less secure over a client certificate. Our recommendation is to secure the RESTful service by using client certificate authentication as described in this article.

This article details how to:
* Set up your web app to use client certificate authentication.
* Upload the certificate to Azure AD B2C policy keys.
* Configure your custom policy to use the client certificate.

## Prerequisites
* Complete the steps in the [Integrate REST API claims exchanges](active-directory-b2c-custom-rest-api-netfw.md) article.
* Get a valid certificate (a .pfx file with a private key).

## Step 1: Configure a web app for client certificate authentication
To set up **Azure App Service** to require client certificates, set the web app `clientCertEnabled` site setting to *true*. To make this change, in the Azure portal, open your web app page. In the left navigation, under **Settings** select **SSL Settings**. In the **Client Certificates** section, turn on the **Incoming client certificate** option.

>[!NOTE]
>Make sure that your Azure App Service plan is Standard or greater. For more information, see [Azure App Service plans in-depth overview](https://docs.microsoft.com/azure/app-service/overview-hosting-plans).

>[!NOTE]
>For more information about setting the **clientCertEnabled** property, see [Configure TLS mutual authentication for web apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-configure-tls-mutual-auth).

## Step 2: Upload your certificate to Azure AD B2C policy keys
After you set `clientCertEnabled` to *true*, the communication with your RESTful API requires a client certificate. To obtain, upload, and store the client certificate in your Azure AD B2C tenant, do the following:
1. In your Azure AD B2C tenant, select **B2C Settings** > **Identity Experience Framework**.

2. To view the keys that are available in your tenant, select **Policy Keys**.

3. Select **Add**.
    The **Create a key** window opens.

4. In the **Options** box, select **Upload**.

5. In the **Name** box, type **B2cRestClientCertificate**.
    The prefix *B2C_1A_* is added automatically.

6. In the **File upload** box, select your certificate's .pfx file with a private key.

7. In the **Password** box, type the certificate's password.

    ![Upload policy key in the Create a key page in Azure portal](media/aadb2c-ief-rest-api-netfw-secure-cert/rest-api-netfw-secure-client-cert-upload.png)

7. Select **Create**.

8. To view the keys that are available in your tenant and confirm that you've created the `B2C_1A_B2cRestClientCertificate` key, select **Policy Keys**.

## Step 3: Change the technical profile
To support client certificate authentication in your custom policy, change the technical profile by doing the following:

1. In your working directory, open the *TrustFrameworkExtensions.xml* extension policy file.

2. Search for the `<TechnicalProfile>` node that includes `Id="REST-API-SignUp"`.

3. Locate the `<Metadata>` element.

4. Change the *AuthenticationType* to *ClientCertificate*, as follows:

    ```xml
    <Item Key="AuthenticationType">ClientCertificate</Item>
    ```

5. Immediately after the closing `<Metadata>` element, add the following XML snippet:

    ```xml
    <CryptographicKeys>
        <Key Id="ClientCertificate" StorageReferenceId="B2C_1A_B2cRestClientCertificate" />
    </CryptographicKeys>
    ```

    After you add the snippet, your technical profile should look like the following XML code:

    ![Set ClientCertificate authentication XML elements](media/aadb2c-ief-rest-api-netfw-secure-cert/rest-api-netfw-secure-client-cert-tech-profile.png)

## Step 4: Upload the policy to your tenant

1. In the [Azure portal](https://portal.azure.com), switch to the [context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md), and then select **Azure AD B2C**.

2. Select **Identity Experience Framework**.

3. Select **All Policies**.

4. Select **Upload Policy**.

5. Select the **Overwrite the policy if it exists** check box.

6. Upload the *TrustFrameworkExtensions.xml* file, and then ensure that it passes validation.

## Step 5: Test the custom policy by using Run Now
1. Open **Azure AD B2C Settings**, and then select **Identity Experience Framework**.

    >[!NOTE]
    >Run Now requires at least one application to be preregistered on the tenant. To learn how to register applications, see the Azure AD B2C [Get started](active-directory-b2c-get-started.md) article or the [Application registration](active-directory-b2c-app-registration.md) article.

2. Open **B2C_1A_signup_signin**, the relying party (RP) custom policy that you uploaded, and then select **Run now**.

3. Test the process by typing **Test** in the **Given Name** box.
    Azure AD B2C displays an error message at the top of the window.

    ![Given Name text box highlighted and input validation error shown](media/aadb2c-ief-rest-api-netfw-secure-basic/rest-api-netfw-test.png)

4. In the **Given Name** box, type a name (other than "Test").
    Azure AD B2C signs up the user and then sends a loyalty number to your application. Note the number in this JWT example:

   ```
   {
     "typ": "JWT",
     "alg": "RS256",
     "kid": "X5eXk4xyojNFum1kl2Ytv8dlNP4-c57dO6QGTVBwaNk"
   }.{
     "exp": 1507125903,
     "nbf": 1507122303,
     "ver": "1.0",
     "iss": "https://contoso.b2clogin.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
     "aud": "e1d2612f-c2bc-4599-8e7b-d874eaca1ee1",
     "acr": "b2c_1a_signup_signin",
     "nonce": "defaultNonce",
     "iat": 1507122303,
     "auth_time": 1507122303,
     "loyaltyNumber": "290",
     "given_name": "Emily",
     "emails": ["B2cdemo@outlook.com"]
   }
   ```

   >[!NOTE]
   >If you receive the error message, *The name is not valid, please provide a valid name*, it means that Azure AD B2C successfully called your RESTful service while it presented the client certificate. The next step is to validate the certificate.

## Step 6: Add certificate validation
The client certificate that Azure AD B2C sends to your RESTful service does not undergo validation by the Azure App Service platform, except to check whether the certificate exists. Validating the certificate is the responsibility of the web app.

In this section, you add sample ASP.NET code that validates the certificate properties for authentication purposes.

> [!NOTE]
>For more information about configuring Azure App Service for client certificate authentication, see [Configure TLS mutual authentication for web apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-configure-tls-mutual-auth).

### 6.1 Add application settings to your project's web.config file
In the Visual Studio project that you created earlier, add the following application settings to the *web.config* file after the `appSettings` element:

```XML
<add key="ClientCertificate:Subject" value="CN=Subject name" />
<add key="ClientCertificate:Issuer" value="CN=Issuer name" />
<add key="ClientCertificate:Thumbprint" value="Certificate thumbprint" />
```

Replace the certificate's **Subject name**, **Issuer name**, and **Certificate thumbprint** values with your certificate values.

### 6.2 Add the IsValidClientCertificate function
Open the *Controllers\IdentityController.cs* file, and then add to the `Identity` controller class the following function:

```csharp
private bool IsValidClientCertificate()
{
    string ClientCertificateSubject = ConfigurationManager.AppSettings["ClientCertificate:Subject"];
    string ClientCertificateIssuer = ConfigurationManager.AppSettings["ClientCertificate:Issuer"];
    string ClientCertificateThumbprint = ConfigurationManager.AppSettings["ClientCertificate:Thumbprint"];

    X509Certificate2 clientCertInRequest = RequestContext.ClientCertificate;
    if (clientCertInRequest == null)
    {
        Trace.WriteLine("Certificate is NULL");
        return false;
    }

    // Basic verification
    if (clientCertInRequest.Verify() == false)
    {
        Trace.TraceError("Basic verification failed");
        return false;
    }

    // 1. Check the time validity of the certificate
    if (DateTime.Compare(DateTime.Now, clientCertInRequest.NotBefore) < 0 ||
        DateTime.Compare(DateTime.Now, clientCertInRequest.NotAfter) > 0)
    {
        Trace.TraceError($"NotBefore '{clientCertInRequest.NotBefore}' or NotAfter '{clientCertInRequest.NotAfter}' not valid");
        return false;
    }

    // 2. Check the subject name of the certificate
    bool foundSubject = false;
    string[] certSubjectData = clientCertInRequest.Subject.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
    foreach (string s in certSubjectData)
    {
        if (String.Compare(s.Trim(), ClientCertificateSubject) == 0)
        {
            foundSubject = true;
            break;
        }
    }

    if (!foundSubject)
    {
        Trace.TraceError($"Subject name '{clientCertInRequest.Subject}' is not valid");
        return false;
    }

    // 3. Check the issuer name of the certificate
    bool foundIssuerCN = false;
    string[] certIssuerData = clientCertInRequest.Issuer.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
    foreach (string s in certIssuerData)
    {
        if (String.Compare(s.Trim(), ClientCertificateIssuer) == 0)
        {
            foundIssuerCN = true;
            break;
        }
    }

    if (!foundIssuerCN)
    {
        Trace.TraceError($"Issuer '{clientCertInRequest.Issuer}' is not valid");
        return false;
    }

    // 4. Check the thumbprint of the certificate
    if (String.Compare(clientCertInRequest.Thumbprint.Trim().ToUpper(), ClientCertificateThumbprint) != 0)
    {
        Trace.TraceError($"Thumbprint '{clientCertInRequest.Thumbprint.Trim().ToUpper()}' is not valid");
        return false;
    }

    // 5. If you also want to test whether the certificate chains to a trusted root authority, you can uncomment the following code:
    //
    //X509Chain certChain = new X509Chain();
    //certChain.Build(certificate);
    //bool isValidCertChain = true;
    //foreach (X509ChainElement chElement in certChain.ChainElements)
    //{
    //    if (!chElement.Certificate.Verify())
    //    {
    //        isValidCertChain = false;
    //        break;
    //    }
    //}
    //if (!isValidCertChain) return false;
    return true;
}
```

In the preceding sample code, we accept the certificate as valid only if all the following conditions are met:
* The certificate is not expired and is active for the current time on server.
* The `Subject` name of the certificate is equal to the `ClientCertificate:Subject` application setting value.
* The `Issuer` name of the certificate is equal to the `ClientCertificate:Issuer` application setting value.
* The `thumbprint` of the certificate is equal to the `ClientCertificate:Thumbprint` application setting value.

>[!IMPORTANT]
>Depending on the sensitivity of your service, you might need to add more validations. For example, you might need to test whether the certificate chains to a trusted root authority, issuer organization name validation, and so on.

### 6.3 Call the IsValidClientCertificate function
Open the *Controllers\IdentityController.cs* file and then, at the beginning of the `SignUp()` function, add the following code snippet:

```csharp
if (IsValidClientCertificate() == false)
{
    return Content(HttpStatusCode.Conflict, new B2CResponseContent("Your client certificate is not valid", HttpStatusCode.Conflict));
}
```

After you add the snippet, your `Identity` controller should look like the following code:

![Add certificate validation code](media/aadb2c-ief-rest-api-netfw-secure-cert/rest-api-netfw-secure-client-code.png)

## Step 7: Publish your project to Azure and test it
1. In **Solution Explorer**, right-click the **Contoso.AADB2C.API** project, and then select **Publish**.

2. Repeat "Step 6," and re-test your custom policy with the certificate validation. Try to run the policy, and make sure that everything works after you add the validation.

3. In your *web.config* file, change the value of `ClientCertificate:Subject` to **invalid**. Run the policy again and you should see an error message.

4. Change the value back to **valid**, and make sure that the policy can call your REST API.

If you need to troubleshoot this step, see [Collecting logs by using Application Insights](active-directory-b2c-troubleshoot-custom.md).

## (Optional) Download the complete policy files and code
* After you complete the [Get started with custom policies](active-directory-b2c-get-started-custom.md) walkthrough, we recommend that you build your scenario by using your own custom policy files. For your reference, we have provided [Sample policy files](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/aadb2c-ief-rest-api-netfw-secure-cert).
* You can download the complete code from [Sample Visual Studio solution for reference](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/aadb2c-ief-rest-api-netfw/Contoso.AADB2C.API).
