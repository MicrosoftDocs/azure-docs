# Azure RBAC and ADU

ADU utilizes Azure RBAC to to provide authentication and authorization for users and service Apis.

## Configure access control roles

In order for other users and applications to have access to Device Update, users or applications must be granted access to this resource. Here are the roles that are supported by Device Update

|   Role Name   | Description  |
| :--------- | :---- |
|  Device Update Administrator | Has access to all device update resources  |
|  Device Update Reader| Can view all updates and deployments |
|  Device Update Content Administrator | Can view, import, and delete updates  |
|  Device Update Content Reader | Can view updates  |
|  Device Update Deployments Administrator | Can manage deployment of updates to devices|
|  Device Update Deployments Reader| Can view deployments of updates to devices |

A combination of roles can be used to provide the right level of access, for example a developer can import and manage updates using the Device Update Content Administrator role, but can view the progress of an update using the Device Update Deployments Reader role. Conversely, a solution operator can have the Device Update Reader role to view all updates, but can use the Device Update Deployments Administrator role to deploy a specific update to devices.

### To set the Access Control Policy

1. Go to Access control (IAM)
2. Click "Add" within "Add a role assignment"
3. For "Select a Role", select "Device Update Administrator"
4. Assign access to a user or Azure AD group
5. Click Save
6. You can now go to IoT Hub and go to Device Update

## Authenticate to ADU REST APIs for Publishing and Management

ADU also utilizes Azure AD for authentication to publish and manage content via service APIs. To get started you need to create and configure a client application.

### Create client Azure AD App

To integrate an application or service with Azure AD, [first register](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) an application with Azure AD. Client application setup varies depending on the authorization flow used.  Configuration below is for guidance when using the ADU REST APIs.

* Set client authentication: 'redirect URIs for native or web client'.
* Set API Permissions - Azure Device Update exposes:
  * Delegated permissions: 'user_impersonation'
  * **Optional**, grant admin consent

