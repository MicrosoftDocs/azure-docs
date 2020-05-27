# Tutorial: Integrating Twilio Verify App with Azure Active Directory B2C

In this tutorial, learn how to configure with Twilio Verify app and integrating with Azure AD B2C. By using  Twilio Verify App, Azure AD B2C customers can comply with PSD2 transaction requirements through dynamic linking and strong customer authentication.  

## Onboarding with Twilio

1. Obtain a [trial account](https://www.twilio.com/try-twilio) at Twilio

2. Purchase a Phone number at Twilio using [this article](https://support.twilio.com/hc/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console)

3. Navigate to [Verify API](https://www.twilio.com/console/verify/services) at the Twilio console and follow [instructions](https://www.twilio.com/docs/verify/verifying-transactions-psd2) to create a service and enable the PSD2 option.  

## Configuring Verify App with Azure AD B2C

1. Open the B2C-WebAPI-DotNet solution and replace the following values with your own tenant-specific values in the web.config:

 ```xml
<add key="ida:Tenant" value="yourtenant.onmicrosoft.com" />
<add key="ida:TenantId" value="d6f33888-0000-4c1f-9b50-1590f171fc70" />
<add key="ida:ClientId" value="6bd98cc8-0000-446a-a05e-b5716ef2651b" />
<add key="ida:ClientSecret" value="secret" />
<add key="ida:AadInstance" value="https://yourtenant.b2clogin.com/tfp/{0}/{1}" />
<add key="ida:RedirectUri" value="https://your hosted psd2 demo app url/" />
```

2. The Web app also hosts the ID token hint generator and metadata endpoint

   - Create your signing certificate as shown here

   - Update the following lines based on  your certificate in the web.config:

```xml
<add key="ida:SigningCertThumbprint" value="4F39D6014818082CBB763E5BA5F230E545212E89" />
<add key="ida:SigningCertAlgorithm" value="RS256" />
```

3. Upload the demo application to your hosting provider of choice - guidance for Azure App services is here to also upload your certificate.

4. Update your Azure AD B2C application registration by adding a Reply URL equivalent to the URL at which the application is hosted at.

5. Open the policy files and replace all instances of contoso with your tenant name.

6. Find the Twilio REST API technical profile **Custom-SMS-Enroll**. Update the ServiceURL with your Twilio AccountSID and the From number to your purchased phone number.

7. Find the Twilio REST API technical profiles, **TwilioRestAPI-Verify-Step1** and **TwilioRestAPI-Verify-Step2**, and update the ServiceURL with your Twilio AccountSID.

8. In the Azure portal, go to **Azure AD B2C** > **Identity Experience Framework** >**Policy Keys**

9. Add a new Key, name it  **B2cRestTwilioClientId**. Select **manual**, and provide the value of the Twilio AccountSID.

10. Add a new Key, name it  **B2cRestTwilioClientSecret**. Select **manual**, and provide the value of the Twilio AUTH TOKEN.

11. Upload all the policy files to your tenant.

12. Customize the string in the GenerateOTPMessageEnrol claims transform for your sign up SMS text.

13. Browse to your application and test the sign in/up and Send Money action.

## Additional resources  

1. Refer to GitHub for [code samples](https://github.com/azure-ad-b2c/samples/tree/master/policies/twilio-mfa-psd2)  

2. [Custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

3. [Get started with custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications) 
