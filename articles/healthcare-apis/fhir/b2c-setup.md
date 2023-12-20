---
title: Enable single sign-on access by using Azure Active Directory B2C with the FHIR service
description: Learn how to simplify the sign-in process for the FHIR service by using Azure Active Directory B2C.
services: healthcare-apis
author: namalu
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 01/15/2024
ms.author: namalu
---

# Enable single sign-on by using Azure Active Directory B2C with the FHIR service

By using [Azure Active Directory B2C](../../../active-directory-b2c/overview.md) with the [FHIR service](../overview.md), healthcare providers can enable patients and clients to use their preferred social, enterprise, or local account identities to gain single sign-on access to healthcare applications, providing a seamless and consistent sign-in experience across various applications and APIs.

To set up single sign-on:

1. Set up an Azure B2C tenant for the FHIR service.
1. Deploy the FHIR service with B2C configured.
1. Validate everything works as expected.

## Set up an Azure B2C tenant for the FHIR service

After you complete the steps in this section, the B2C tenant can grant access tokens to access FHIR service resources.

- [Deploy an Azure B2C tenant by using an ARM template](#deploy-an-azure-b2c-tenant-by-using-an-arm-template).

- [Add a test user to B2C](#add-a-test-user-to-b2c).

- [Add the fhirUser custom user attribute](#add-the-fhiruser-custom-user-attribute).

- [Create a new B2C user flow](#create-a-new-b2c-user-flow).

- [Create a new B2C resource application](#create-a-new-b2c-resource-application).

#### Deploy an Azure B2C tenant by using an ARM template

Follow the steps to [deploy an instance of Azure Active Directory B2C](/azure/templates/microsoft.azureactivedirectory/b2cdirectories?pivots=deployment-language-arm-template). Use PowerShell or Azure CLI to deploy the [ARM template](templates/b2c-arm-template.json) to an Azure subscription.

#### [PowerShell](#tab/powershell)

- Run code in PowerShell locally in Visual Studio Code or in Azure Cloud Shell to deploy the B2C tenant.

- Use `Connect-AzAccount` to sign in to Azure. After you sign in, use `Get-AzContext` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

- Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `New-AzResourceGroup`.

```PowerShell
### variables
$tenantid="your tenant id"
$subscriptionid="your subscription id"
$resourcegroupname="your resource group name"
$b2cName="your b2c tenant name"

### login to azure
Connect-AzAccount 
#Connect-AzAccount SubscriptionId $subscriptionid
Set-AzContext -Subscription $subscriptionid
Connect-AzAccount -Tenant $tenantid -SubscriptionId $subscriptionid
#Get-AzContext 

### create resource group
New-AzResourceGroup -Name $resourcegroupname -Location $region

### deploy the resource
New-AzResourceGroupDeployment -ResourceGroupName $resourcegroupname -TemplateFile "templates/b2c-arm-template.json" -b2cName $b2cName
```

#### [Azure CLI](#tab/command-line)

- Run the code locally in Visual Studio Code or in Azure Cloud Shell to deploy the FHIR service.

- Use `Connect-AzAccount` to sign in to Azure. After you sign in, use `az account show --output table` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `az group create`.

```bash
### variables
tenantid=your tenant id
subscriptionid=your subscription id
resourcegroupname=your resource group name
b2cName=your b2c tenant name

### login to azure
az login
az account show --output table
az account set --subscription $subscriptionid

### create resource group
az group create --name $resourcegroupname --location $region

### deploy the resource
az deployment group create --resource-group $resourcegroupname --template-file 'templates/b2c-arm-template.json' --parameters b2cName=$b2cName
```

---

After the deployment completes, navigate to the B2C resource in the Azure portal and then open the tenant by selecting the `Open B2C Tenant`` link. More detailed documentation about managing users can be found [here](../../active-directory-b2c/manage-users-portal.md).

:::image type="content" source="media/b2c-setup/b2c-resource.png" alt-text="Screenshot showing a B2C resource" lightbox="media/b2c-setup/b2c-resource.png":::

#### Add a test user to B2C

On the home page of the B2C tenant, choose **Users**.

:::image type="content" source="media/b2b-setup/b2c-home-user.png" alt-text="Screenshot showing home user" lightbox="media/b2b-setup/b2c-home-user.png":::

Choose **+ New user**.

:::image type="content" source="media/b2c-setup/b2c-add-user.png" alt-text="Screenshot showing adding new user" lightbox="media/b2c-setup/b2c-add-user.png":::

#### Add the fhirUser custom user attribute

The `fhirUser` user attribute is used to link a B2C user with a user resource in the FHIR service. In this tutorial, a user named "Test Patient1" is created in the B2C tenant, and in a later step, a [Patient](https://www.hl7.org/fhir/patient.html) resource will be created in the FHIR service. The "Test Patient1" user will be linked to the Patient resource by adding setting the fhirUser attribute value to the Patient resource identifier - more on this later. Detailed documentation about B2C custom attributes can be found [here](/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow).

From the B2C tenant home page, select "User attributes", then "+ Add". Under "Name" type "fhirUser", and under "Data Type" select "String", click "Create". It's important that the attribute name is properly cased.

:::image type="content" source="media/b2c-setup/b2c-attribute.png" alt-text="Screenshot showing B2C attribute" lightbox="media/b2c-setup/b2c-attribute.png":::

### Create a new B2C user flow

User flows define the experience that end users will see when they are logging in or creating a new user. In this tutorial a user flow is created so that once a user signs in, the access token provided will include the "fhirUser" claim. Detailed documentation about B2C user flows can be found [here](https://learn.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-user-flow).

From the B2C tenant home page, select "User flows", and then "+ New user flow".

:::image type="content" source="media/b2c-setup/b2c-user-flow.png" alt-text="Screenshot showing B2C user flow" lightbox="media/b2c-setup/b2c-user-flow.png":::

Give the user flow a unique name (the name is not globally unique, jut unique within the B2C tenant). In this example the name of the user flow is "USER_FLOW_1". Make note of the name given to the user flow, as it will be used in a later step.

Make sure "Email signin" is enabled for Local accounts. This will provide a way for the user created in an earlier step to sign in to obtain an access token to the FHIR service.

:::image type="content" source="media/b2c-setup/b2c-user-flow-config1.png" alt-text="Screenshot showing B2C user flow config1" lightbox="media/b2c-setup/b2c-user-flow-config1.png":::

Scroll to the bottom of the page and in section 5 "Application Claims", click "Show more...". This will launch a side panel with a list of all available claims. Select the "fhirUser" claim from the list and click "Ok". Click the "Create" button to create the user flow.

:::image type="content" source="media/b2c-setup/b2c-user-flow-config2.png" alt-text="Screenshot showing B2C user flow config2" lightbox="media/b2c-setup/b2c-user-flow-config2.png":::

### Create a new B2C resource application

From the B2C tenant home page, select "App registrations", and then "+ New registration".

:::image type="content" source="media/b2c-setup/b2c-new-application.png" alt-text="Screenshot showing B2C new application" lightbox="media/b2c-setup/b2c-new-application.png":::

* Add a display name (FHIR Service in this example).
* Select "Accounts in any identity provider or organizational directory (for authenticating users with user flows) from the "Supported account types" options.
* Select "Public client/native (mobile & desktop)" from the list of platforms under the "Redirect URI (recommended)" section. Populate the value with the [Postman](https://www.postman.com) callback URI [https://oauth.pstmn.io/v1/callback](#create-a-new-b2c-resource-application). The callback will be used in a later step when testing using Postman.
* Select "Grant admin consent to openid and offline_access permissions".
* Click "Register".

Wait for the application registration to complete. Once completed, the browser will navigate to the application "Overview" blade.

:::image type="content" source="media/b2c-setup/b2c-application-register.png" alt-text="Screenshot showing B2C application register" lightbox="media/b2c-setup/b2c-application-register.png":::

Click on "Manifest" in the left menu, and scroll until you find the "oauth2Permissions" array. Replace the array with one or more values in the [oauth2Permissions.json](/oauth2Permissions.json) file. The entire array can be copied, or individual permissions can be copied. It's important to understand that if a permission is added to the list, any user in the B2C tenant can obtain an access token with the API permission. If a level of access in not appropriate for a user within the B2C tenant, the permission should not be added to the array because there is no way to limit permissions to a subset of users.

Once the "oauth2Permissions" array has been populated, click "Save".

:::image type="content" source="media/b2c-setup/b2c-application-manifest.png" alt-text="Screenshot showing B2C application manifest" lightbox="media/b2c-setup/b2c-application-manifest.png":::

Click on "Expose an API" in the left menu, and then click "Add". By default, the "Application ID URI" will be populated with the Application (client) Id. The value can be changed if desired, in the case of this tutorial the value was changed to "Fhir" for readability purposes, but this is not necessary. Click "Save" when done.

:::image type="content" source="media/b2c-setup/b2c-application-api.png" alt-text="Screenshot showing B2C application API" lightbox="media/b2c-setup/b2c-application-api.png":::

Click on "API permissions" in the left menu, and then click "+ Add a permission". This will bring up a side panel to configure API permissions.

:::image type="content" source="media/b2c-setup/b2c-api-permission1.png" alt-text="Screenshot showing B2C API permission1" lightbox="media/b2c-setup/b2c-api-permission1.png":::

In the "Request API permissions" side panel, select "APIs my organization uses" and select the resource application from the list of applications. When the application is selected, the list of permissions will be displayed.

:::image type="content" source="media/b2c-setup/b2c-api-permission2.png" alt-text="Screenshot showing B2C API permission1" lightbox="media/b2c-setup/b2c-api-permission2.png":::

Select at least one permission from the list under "patient". In this example, the permission "patient.all.all" is selected. This means that a user that requests an access token with the scope "patient.all.all" will have Read, Write and Delete privileges (patient.all.**all**) over all FHIR resources (patient.**all**.all) in the (**patient**.all.all) [Patient compartment](https://build.fhir.org/compartmentdefinition-patient.html).

Once the permissions have been selected, click "Add permissions".

:::image type="content" source="media/b2c-setup/b2c-api-permission3.png" alt-text="Screenshot showing B2C API permission3" lightbox="media/b2c-setup/b2c-api-permission3.png":::

After the "Request API permissions" side panel closes, click on the "Grant admin consent" button.

:::image type="content" source="media/b2c-setup/b2c-api-permission4.png" alt-text="Screenshot showing B2C API permission4" lightbox="media/b2c-setup/b2c-api-permission4.png":::

## Deploy FHIR service with Azure Active Directory B2C identity provider

Configuring B2C is useful when an organization wants to grant access to resources in the FHIR service to users that are not in their [Azure Entra](https://learn.microsoft.com/entra/fundamentals/whatis) tenant.

After you complete these the steps in this section, test the FHIR service to make sure everything works as expected.

### Obtain the B2C authority and client ID

There are 2 parameters used to configure the FHIR service to use an Azure B2C tenant as an identity provider, authority and client ID.

The authority string can be created using the name of the B2C tenant and the name of the user flow.

```text
https://<YOUR_B2C_TENANT_NAME>.b2clogin.com/<YOUR_B2C_TENANT_NAME>.onmicrosoft.com/<YOUR_USER_FLOW_NAME>/v2.0
```

The authority string can be tested by making a request to the `.well-known/openid-configuration` endpoint.

```text
https://<YOUR_B2C_TENANT_NAME>.b2clogin.com/<YOUR_B2C_TENANT_NAME>.onmicrosoft.com/<YOUR_USER_FLOW_NAME>/v2.0/.well-known/openid-configuration
```

The string can be entered into a browser, and it should navigate to the OpenId Configuration JSON file. If the OpenId Configuration JSON fails to load, check to make sure the B2C tenant name and user flow name are correct.

The client ID (also known as application ID) can be retrieved from the resource application overview page (created in the [azure-b2c-setup.md](/azure-b2c-setup.md#create-a-new-b2c-resource-application)).

![b2c-client-id](media/b2b-setup/b2c-client-id.png)

### Deploy FHIR service using an ARM Template

An [ARM Template](templates/fhir-service-arm-template.json) has been created to simplify deploying the Azure Health Data Services FHIR Service. You can use PowerShell or Azure CLI to deploy the ARM template to an Azure Subscription.

##### Use PowerShell

- Run the code in PowerShell locally, in Visual Studio Code, or in Azure Cloud Shell, to deploy the FHIR service.

- If you haven't logged in to Azure, use "Connect-AzAccount" to log in. Once you've logged in, use "Get-AzContext" to verify the subscription and tenant you want to use. You can change the subscription and tenant if needed.

- You can create a new resource group, or use an existing one by skipping the step or commenting out the line starting with “New-AzResourceGroup”.

```PowerShell
### variables
$tenantid="your tenant id"
$subscriptionid="your subscription id"
$resourcegroupname="your resource group name"
$region="your desired region"
$workspacename="your workspace name"
$fhirServiceName="your fhir service name"
$smartAuthorityUrl="your authority (from previous step)"
$smartClientId="your client id (from previous step)"

### login to azure
Connect-AzAccount 
#Connect-AzAccount SubscriptionId $subscriptionid
Set-AzContext -Subscription $subscriptionid
Connect-AzAccount -Tenant $tenantid -SubscriptionId $subscriptionid
#Get-AzContext 

### create resource group
New-AzResourceGroup -Name $resourcegroupname -Location $region

### deploy the resource
New-AzResourceGroupDeployment -ResourceGroupName $resourcegroupname -TemplateFile "templates/fhir-service-arm-template.json" -tenantid $tenantid -region $region -workspaceName $workspacename -fhirServiceName $fhirservicename -smartAuthorityUrl $smartAuthorityUrl -smartClientId $smartClientId
```

##### Use Azure CLI

Run the code locally, in Visual Studio Code or in Azure Cloud Shell, to deploy the FHIR service.

If you haven’t logged in to Azure, use "az login" to log in. Once you've logged in, use "az account show --output table" to verify the subscription and tenant you want to use. You can change the subscription and tenant if needed.

You can create a new resource group, or use an existing one by skipping the step or commenting out the line starting with "az group create".

```bash
### variables
tenantid=your tenant id
subscriptionid=your subscription id
resourcegroupname=your resource group name
region=your desired region
workspacename=your workspace name
fhirServiceName=your fhir service name
smartAuthorityUrl=your authority (from previous step)
smartClientId=your client id (from previous step)

### login to azure
az login
az account show --output table
az account set --subscription $subscriptionid

### create resource group
az group create --name $resourcegroupname --location $region

### deploy the resource
az deployment group create --resource-group $resourcegroupname --template-file 'templates/fhir-service-arm-template.json' --parameters tenantid=$tenantid region=$region workspaceName=$workspacename fhirServiceName=$fhirservicename smartAuthorityUrl=$smartAuthorityUrl storageAccountConfirm=$smartClientId
```

## Validate Azure B2C users can access FHIR Resources

This section provides instructions on how to validate your FHIR service and B2C tenant is configured properly.

- Create a Patient Resource in the FHIR service
- Link the Patient Resource to the Azure B2C user
- Configure Postman to obtain an access token for B2C users
- Fetch the Patient Resource using the B2C user

### Prerequisites

* An Azure Active Directory B2C tenant configured as outlined in [this](/azure-b2c-setup.md) document.
* An Azure Health Data Services FHIR Service has been deployed as outlined in [this](/deploy-fhir-service.md) document.
* The [Postman](https://www.postman.com) application running locally or on a web browser.

### Create a patient resource in the FHIR service

It's important to note that users in the B2C tenant will not be able to create, read update or delete any resources until the user is linked to a FHIR resource (such as Patient or Practitioner). This initial step must be performed by a user in the Microsoft Entra ID where the FHIR service is tenanted that has the `FhirDataWriter` or `FhirDataContributor` role.

Follow the instructions in [this](https://learn.microsoft.com/azure/healthcare-apis/fhir/use-postman) document to obtain the proper access to the FHIR service.

When following the instructions in the [GET FHIR resource](https://learn.microsoft.com/azure/healthcare-apis/fhir/use-postman#get-fhir-resource) section, the request will return an empty response. This is because the FHIR service is new and has no Patient resources.

Create a Patient with a specific identifier by changing the method to `PUT` and executing a request to `{{fhirurl}}/Patient/1` with the following body:

```json
{
    "resourceType": "Patient",
    "id": "1",
    "name": [
        {
            "family": "Patient1",
            "given": [
                "Test"
            ]
        }
    ]
}
```

You can verify the patient was created by changing the method back to `GET` and verifying that a request to `{{fhirurl}}/Patient` returns the newly created patient.

### Link the Patient Resource to the Azure B2C user

In the [azure-b2c-setup.md](/azure-b2c-setup.md#add-a-test-user-to-b2c) a user was created named "Test Patient1", and the FHIR service now contains a Patient resource that represents "Test Patient1". An explicit link between the user in the B2C tenant and the Resource in teh FHIR service must be created. This is done using Extension Attributes in Microsoft Graph. An detailed explanation of these concepts can be found [here](https://learn.microsoft.com/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow).

Navigate to the B2C tenant and click on "App registrations" in the left menu, then select "All applications" and click on the item with the prefix "b2c-extensions-app".

:::image type="content" source="media/b2c-setup/b2c-app-list.png" alt-text="Screenshot showing B2C app list" lightbox="media/b2c-setup/b2c-app-list.png":::

Note the Application (client) ID value. This value is used in a later step.

:::image type="content" source="media/b2c-setup/b2c-extensions-app.png" alt-text="Screenshot showing B2C extensions app" lightbox="media/b2c-setup/b2c-extensions-app.png":::

Navigate back to the B2C tenant home page and click on "Users" in the left menu.

:::image type="content" source="media/b2c-setup/b2c-home-user.png" alt-text="Screenshot showing B2C home user" lightbox="media/b2c-setup/b2c-home-user.png":::

Select the test user that was created in the [azure-b2c-setup.md](/azure-b2c-setup.md#add-a-test-user-to-b2c).

:::image type="content" source="media/b2c-setup/b2c-user-list.png" alt-text="Screenshot showing B2C user list" lightbox="media/b2c-setup/b2c-user-list.png":::

Note the Object ID value. This value is used in a later step.

:::image type="content" source="media/b2c-setup/b2c-user-id.png" alt-text="Screenshot showing B2C user ID" lightbox="media/b2c-setup/b2c-user-id.png":::

Now, Navigate to the Microsoft Graph Explorer [https://developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/graph/graph-explorer), and login with a user that has the Global Administrator role for the B2C tenant. (It is a good idea to create a new Admin user in the B2C tenant to manage users in the tenant.)

:::image type="content" source="media/b2c-setup/graph-login.png" alt-text="Screenshot showing Graph login" lightbox="media/b2c-setup/graph-login.png":::

Click on the logged in user avatar and then click "Consent to permissions".

:::image type="content" source="media/b2c-setup/graph-consent1.png" alt-text="Screenshot showing Graph consent1" lightbox="media/b2c-setup/graph-consent1.png":::

Scroll down to "User" and Consent to User.ReadWrite.All. This permission will allow you to update the Test Patient1 user with the fhirUser claim value.

:::image type="content" source="media/b2c-setup/graph-consent2.png" alt-text="Screenshot showing Graph consent2" lightbox="media/b2c-setup/graph-consent2.png":::

Once the consent process completes, update the user. You will need the b2c-extensions-app Application (client) ID and the user Object ID from previous steps.

- Change the method to `PATCH`.
- Change the URL to [https://graph.microsoft.com/v1.0/users/{USER_OBJECT_ID}](#link-the-patient-resource-to-the-azure-b2c-user)
- Create the `PATCH` body. This is a single key-value-pair, where the key format is `extension_{B2C_EXTENSION_APP_ID_NO_HYPHENS}_fhirUser` and the value is the fully qualified FHIR resource ID for the patient that was created in a previous step ("https://{YOUR_FHIR_SERVICE}.azurehealthcareapis.com/Patient/1").

More details about formatting the extension attribute can be found [here](https://learn.microsoft.com/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow#manage-extension-attributes-through-microsoft-graph).

Once the request is formatted click "Run query" and wait for a successful response. The user in the B2C tenant is now linked to the Patient resource in the FHIR service.

:::image type="content" source="media/b2c-setup/graph-patch.png" alt-text="Screenshot showing Graph patch" lightbox="media/b2c-setup/graph-patch.png":::

### Configure Postman to obtain an access token for B2C users

Launch the Postman application and create a new "Blank collection". Optionally, you can name the collection. In this example the collection was named "FHIR Patient".

:::image type="content" source="media/b2c-setup/postman-new-collection.png" alt-text="Screenshot showing Postman new collection" lightbox="media/b2c-setup/postman-new-collection.png":::

Select the "Authorization" tab in the collection overview, and from the "Type" dropdown, select "OAuth 2.0".

:::image type="content" source="media/b2c-setup/postman-auth.png" alt-text="Screenshot showing Postman auth" lightbox="media/b2c-setup/postman-auth.png":::

Scroll down to the "Configure New Token" section and add the following values:

#### Callback URL

This value was configured when the B2C Resource application was created [azure-b2c-setup.md](/azure-b2c-setup.md#create-a-new-b2c-resource-application)

```text
https://oauth.pstmn.io/v1/callback
```

#### Auth URL

This value can be created using the name of the B2C tenant and the name of the [user flow](/azure-b2c-setup.md#create-a-new-b2c-user-flow).

```text
https://{YOUR_B2C_TENANT_NAME}.b2clogin.com/{YOUR_B2C_TENANT_NAME}.onmicrosoft.com/{YOUR_USER_FLOW_NAME}/oauth2/v2.0/authorize
```

#### Access Token URL

This value can be created using the name of the B2C tenant and the name of the [user flow](/azure-b2c-setup.md#create-a-new-b2c-user-flow).

```text
https://{YOUR_B2C_TENANT_NAME}.b2clogin.com/{YOUR_B2C_TENANT_NAME}.onmicrosoft.com/{YOUR_USER_FLOW_NAME}/oauth2/v2.0/token
```

#### Client ID

This value is the Application (client) ID of the [B2C resource application](/azure-b2c-setup.md#create-a-new-b2c-resource-application).

```text
{YOUR_APPLICATION_ID}
```

#### Scope

This value is defined in the B2C resource application in the "Expose an API" section. in the [example](/azure-b2c-setup.md#create-a-new-b2c-resource-application), the scope that is granted permission is `patient.all.all`. The scope request must be a fully qualified URL (e.g. [https://testb2c.onmicrosoft.com/fhir/patient.all.all](#scope)). *Hint* - The fully qualified scope can be copied from the "Expose an API" section of the B2C resource application.

```text
{YOUR_APPLICATION_ID_URI}/patient.all.all
```

:::image type="content" source="media/b2c-setup/postman-urls.png" alt-text="Screenshot showing Postman URLs" lightbox="media/b2c-setup/postman-urls.png":::

Once all the values have been added click "Save".

## Fetch the Patient Resource using the B2C user

Now that the Authorization configuration in Postman is setup to launch the B2C user flow, an access token can be obtained by clicking "Get New Access Token".

:::image type="content" source="media/b2c-setup/postman-get-token1.png" alt-text="Screenshot showing Postman get token1" lightbox="media/b2c-setup/postman-get-token1.png":::

The B2C Sign in user flow is launched, and the Test Patient credentials can be used to sign in.

:::image type="content" source="media/b2c-setup/postman-get-token2.png" alt-text="Screenshot showing Postman get token2" lightbox="media/b2c-setup/postman-get-token2.png":::

Once the B2C Sign in user flow completes, a window to manage the new access token is displayed. Click "Use Token" to use the access token for any requests in teh collection.

:::image type="content" source="media/b2c-setup/postman-use-token.png" alt-text="Screenshot showing Postman use token" lightbox="media/b2c-setup/postman-use-token.png":::

Create a new request to search for Patient resources in the FHIR service. Click the 3 dots (...) next to the name of the collection and click "Add request".

:::image type="content" source="media/b2b-setup/postman-request1.png" alt-text="Screenshot showing Postman request1" lightbox="media/b2b-setup/postman-request1.png":::

Set the method to `GET`, type in your fully qualified FHIR service URL and add the path `/Patient`. Click "Send" and verify the the response contains the single Patient resource created in a [previous step](#create-a-patient-resource-in-the-fhir-service).

:::image type="content" source="media/b2b-setup/postman-request2.png" alt-text="Screenshot showing Postman request2" lightbox="media/b2b-setup/postman-request2.png":::