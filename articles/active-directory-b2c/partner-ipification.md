# Tutorial for configuring IPification with Azure Active Directory B2C

This tutorial describes, how to integrate Azure AD B2C authentication with IPfication to provide IPification secure IP-based authentication to your end users.
This integration will enable IPification authentication to be used as:

- A primary seamless authentication function
- A secure two factor authentication in a multi-factor authentication flow.

## Onboarding with IPification

1. The IPification authentication solution uses a standard Open ID Connect (OIDC) protocol REST API to connect the service provider to the IPification solution. When integrating IPification with Azure AD, use the Microsoft OIDC library within the Azure policies to configure the Microsoft OIDC client invoke authentication.

2. Access to the service is simple:

   a. [Contact IPification team](https://ipification.com/contact-us) to create your account and to provide you the client details you need to access their client API.

   b. Step a will give you the client_id and client_secret credentials that you need to access the service.

   c. Provide a list of redirect URIs to be configured for your client that will be your Azure AD B2C endpoint.

   d. An account and credentials for the service will be issued to you.

3. Using these credentials, you can get access to IPification sandbox environment, enabling you to test the Azure AD integration policies that are integrated with IPification.  

4. Following successful Sandbox testing you can discuss with IPification which markets and mobile operators the service will be launched.

5. The IPification onboarding team will then enable live connections to the requested operator services and will hand-hold you through the testing and release cycle for each service.

6. You can find showcase examples for some of the use cases you can deploy using IPification technology at [https://test.ipification.com](https://test.ipification.com)

7. To get started, and get set up with an account and access to the Sandbox [contact IPification](https://ipification.com/contact-us)  

## Configuring IPification with Azure AD B2C

Below two different types of authentication options are mentioned for integrating Azure AD B2C policies with IPification.

**Scenario 1**: Passwordless/Phone number sign-in

The policies start with Phone demonstrating how to leverage IPification as a silent phone-based passwordless authentication provider. The policy falls-back to SMS when IPification is unable to verify the user.

This scenario is based on the [phone-number-passwordless starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/phone-number-passwordless).

**Scenario 2**:  Email/Social and multi-factor authentication sign-in

The policies start with MFA demonstrating how to leverage IPification as a multi-factor authentication option to verify a user's mobile number silently. The policy falls-back to SMS when IPification is unable to verify the user.

This scenario is based on the [SocialAndLocalAccountsWithMfa starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/SocialAndLocalAccountsWithMfa).

## Additional resources  

- Refer to GitHub for [code samples](https://github.com/azure-ad-b2c/integration-demo-ipification)  

- [Custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in AAD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
