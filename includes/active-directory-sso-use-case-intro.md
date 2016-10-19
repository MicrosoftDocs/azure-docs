Organizations are using more [Software as a Service (SaaS)](https://azure.microsoft.com/overview/what-is-saas/) applications for productivity because cloud technology and tools are becoming more readily available. As the number of SaaS apps grows, it becomes challenging for the administrators to manage accounts and access rights, and for the users to remember their different passwords. Managing these applications individually creates extra work and is less secure.


- Employees who have to keep track of many passwords tend to use less-secure methods to remember them, either writing down passwords or using the same passwords across many accounts.

- When a new employee arrives or one leaves, all their accounts must be individually provisioned or de-provisioned.

- Additionally, employees may start using SaaS apps for their work without going through IT, which means they are creating their own accounts on systems that the IT administrators haven't approved and aren't monitoring.  

A solution for all of these challenges is single sign-on (SSO). It's the simplest way to manage multiple apps and provide users with a consistent sign-on experience. Azure Active Directory (Azure AD) provides a robust SSO solution and has many available pre-integrated applications, with tutorials for admins to quickly set up a new app and start provisioning users.


## How does Azure Active Directory integrate apps?  

Azure AD allows you to integrate your apps and provisioned accounts. This can be done through either of two approaches.

- If the app is pre-integrated in the app Gallery, you can go through that portal to set up apps and configure the settings to allow SSO. For any Gallery app, you can get started by follow the simple step-by-step instructions presented in the app gallery and in the Azure portal to enable single sign-on.

- If the app is not in the Gallery, you can still set up most apps in Azure AD as a custom app. This requires a bit more technical expertise to configure. You can add any application that supports SAML 2.0 as a federated app, or any application that has an HTML-based sign-in page as a password SSO app.

In the case where users have created their own accounts for SaaS apps that aren't managed by IT, the [Cloud App Discovery](../articles/active-directory/active-directory-cloudappdiscovery-whatis.md) tool provides a solution. This tool monitors the web traffic to identify which apps are being used throughout the organization, and the number of people using each of them. IT can use this information to learn what apps the users prefer and decide which to integrate into Azure AD for SSO.  

When you integrate an app into Azure AD, you can map the users' established application identities to their respective Azure AD identities.  
