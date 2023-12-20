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

By using [Azure Active Directory B2C](../../../active-directory-b2c/overview.md) with the [FHIR service](../overview.md), healthcare providers can enable users to gain single sign-on access to healthcare applications with their preferred social, enterprise, or local account identities, providing a seamless and consistent sign-in experience across various applications and APIs.

To enable single sign-on for the FHIR service:

1. Set up an Azure B2C tenant for the FHIR service.
1. Deploy the FHIR service with B2C configured.
1. Validate everything works as expected.

## Step 1: Create an Azure B2C tenant for the FHIR service

After you complete the steps in this section, the B2C tenant can grant access tokens to access FHIR service resources.

- [Deploy an Azure B2C tenant by using an ARM template](#deploy-an-azure-b2c-tenant-by-using-an-arm-template).

- [Add a test user to the Azure B2C tenant](#add-a-test-user-to-the-azure-b2c-tenant).

- [Add the `fhirUser` custom user attribute](#add-the-fhiruser-custom-user-attribute).

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

- Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `az group create`.

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

#### Add a test user to the Azure B2C tenant

1. After the deployment completes, in the Azure portal go to the B2C resource. Choose **Open B2C Tenant**.

   :::image type="content" source="media/b2c-setup/b2c-resource.png" alt-text="Screenshot showing a B2C resource" lightbox="media/b2c-setup/b2c-resource.png":::

2. On the left pane, choose **Users**.

   :::image type="content" source="media/b2c-setup/b2c-home-user.png" alt-text="Screenshot showing home user" lightbox="media/b2c-setup/b2c-home-user.png":::

3. Choose **+ New user**.

   :::image type="content" source="media/b2c-setup/b2c-add-user.png" alt-text="Screenshot showing adding new user" lightbox="media/b2c-setup/b2c-add-user.png":::

#### Add the `fhirUser` custom user attribute

The `fhirUser` custom user attribute is used to link a B2C user with a user resource in the FHIR service. In this example, a user named **Test Patient1** is created in the B2C tenant, and then a [patient](https://www.hl7.org/fhir/patient.html) resource is created in the FHIR service. The **Test Patient1** user is linked to the patient resource by setting the `fhirUser` attribute value to the patient resource identifier. Detailed documentation about B2C custom attributes can be found [here](/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow).

1. On the **Azure AD B2C** page, in the left pane select **User attributes**.
1. Choose **+ Add**.
1. In the **Name** field, enter **fhirUser** (case-sensitive).
1. From the **Data Type** dropdown list, select **String**.
1. Choose **Create**.

   :::image type="content" source="media/b2c-setup/b2c-attribute.png" alt-text="Screenshot showing B2C attribute" lightbox="media/b2c-setup/b2c-attribute.png":::

### Create a new B2C user flow

User flows define the experience when users sign in or when an administrator adds a new user. In this example, a user flow is defined so that when a user signs in, the access token provided includes the `fhirUser` claim. Detailed documentation about B2C user flows can be found [here](https://learn.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-user-flow).

1. On the **Azure AD B2C** page, in the left pane select **User flows**.
1. Choose **+ New user flow**.

   :::image type="content" source="media/b2c-setup/b2c-user-flow.png" alt-text="Screenshot showing B2C user flow" lightbox="media/b2c-setup/b2c-user-flow.png":::

1. Give the user flow a name unique to the B2C tenant. (The name doesn't have to be globally unique.) In this example, the name of the user flow is **USER_FLOW_1**. Make note of the name.

1. Make sure **Email signin** is enabled for local accounts so that the test user can sign in and obtain an access token for the FHIR service.

   :::image type="content" source="media/b2c-setup/b2c-user-flow-config1.png" alt-text="Screenshot showing B2C user flow config1" lightbox="media/b2c-setup/b2c-user-flow-config1.png":::

1. Scroll to the bottom of the page. In section 5 **Application Claims**, select **Show more...** to display a list of all available claims. Select the **fhirUser** claim and then choose **Ok**. Choose **Create**.

   :::image type="content" source="media/b2c-setup/b2c-user-flow-config2.png" alt-text="Screenshot showing B2C user flow config2" lightbox="media/b2c-setup/b2c-user-flow-config2.png":::

### Create a new B2C resource application

1. On the **Azure AD B2C** page, on the left pane select **App registrations**.
1. Choose **+ New registration**.

   :::image type="content" source="media/b2c-setup/b2c-new-application.png" alt-text="Screenshot showing B2C new application" lightbox="media/b2c-setup/b2c-new-application.png":::

1. Add a display name (FHIR Service in this example).
1. Select "Accounts in any identity provider or organizational directory (for authenticating users with user flows) from the "Supported account types" options.
1. Select "Public client/native (mobile & desktop)" from the list of platforms under the "Redirect URI (recommended)" section. Populate the value with the [Postman](https://www.postman.com) callback URI [https://oauth.pstmn.io/v1/callback](#create-a-new-b2c-resource-application). The callback URI is for testing purposes.
1. Select **Grant admin consent to openid and offline_access permissions**.
1. Choose **Register**.
1. Wait for the application registration to complete. The browser automatically navigates to the application **Overview** page.

   :::image type="content" source="media/b2c-setup/b2c-application-register.png" alt-text="Screenshot showing B2C application register" lightbox="media/b2c-setup/b2c-application-register.png":::

1. On the left pane, choose **Manifest**. Scroll until you find the `oauth2Permissions` array. Replace the array with one or more values in the [oauth2Permissions.json](/oauth2Permissions.json) file. You can copy the entire array or individual permissions. If a permission is added to the list, any user in the B2C tenant can obtain an access token with the API permission. If a level of access isn't appropriate for a user within the B2C tenant, don't add to the array because there isn't a way to limit permissions to a subset of users.

1. After the "oauth2Permissions" array populates, choose **Save**.

   :::image type="content" source="media/b2c-setup/b2c-application-manifest.png" alt-text="Screenshot showing B2C application manifest" lightbox="media/b2c-setup/b2c-application-manifest.png":::

1. On the left pane, choose **Expose an API**. Choose **Add**. By default, the **Application ID URI** field is populated with the application (client) ID. You can change the value if desired. In this example, the value is **Fhir** for readability.

1. Choose **Save**.

   :::image type="content" source="media/b2c-setup/b2c-application-api.png" alt-text="Screenshot showing B2C application API" lightbox="media/b2c-setup/b2c-application-api.png":::

1. On the left pane, select **API permissions**.
1. Choose  **+ Add a permission**.

   :::image type="content" source="media/b2c-setup/b2c-api-permission1.png" alt-text="Screenshot showing B2C API permission1" lightbox="media/b2c-setup/b2c-api-permission1.png":::

1. On the **Request API permissions** page, select **APIs my organization uses**.
1. Select the resource application from the list.

   :::image type="content" source="media/b2c-setup/b2c-api-permission2.png" alt-text="Screenshot showing B2C API permission1" lightbox="media/b2c-setup/b2c-api-permission2.png":::

1. From the **Patient** dropdown list, select at least one permission. In this example, the permission "patient.all.all" is selected, which means a user that requests an access token with the scope `patient.all.all` has Read, Write and Delete privileges (patient.all.**all**) for all FHIR resources (patient.**all**.all) in the (**patient**.all.all) For more information, see [Patient compartment](https://build.fhir.org/compartmentdefinition-patient.html).

1. Choose **Add permissions**.

   :::image type="content" source="media/b2c-setup/b2c-api-permission3.png" alt-text="Screenshot showing B2C API permission3" lightbox="media/b2c-setup/b2c-api-permission3.png":::

1. Choose **Grant admin consent**.

   :::image type="content" source="media/b2c-setup/b2c-api-permission4.png" alt-text="Screenshot showing B2C API permission4" lightbox="media/b2c-setup/b2c-api-permission4.png":::

## Step 2: Deploy FHIR service with Azure Active Directory B2C identity provider

Configuring B2C is useful when an organization wants to grant access to resources in the FHIR service to users that aren't in their [Azure Entra](https://learn.microsoft.com/entra/fundamentals/whatis) tenant.

### Obtain the B2C authority and client ID

Use the **authority** and **client ID** (or application ID) parameters to configure the FHIR service to use an Azure B2C tenant as an identity provider.

1. Create the authority string by using the name of the B2C tenant and the name of the user flow.

```text
https://<YOUR_B2C_TENANT_NAME>.b2clogin.com/<YOUR_B2C_TENANT_NAME>.onmicrosoft.com/<YOUR_USER_FLOW_NAME>/v2.0
```

2. Test the authority string by making a request to the `.well-known/openid-configuration` endpoint.

```text
https://<YOUR_B2C_TENANT_NAME>.b2clogin.com/<YOUR_B2C_TENANT_NAME>.onmicrosoft.com/<YOUR_USER_FLOW_NAME>/v2.0/.well-known/openid-configuration
```

3. Enter the string into a browser to confirm it navigates to the OpenId Configuration JSON file. If the OpenId Configuration JSON fails to load, make sure the B2C tenant name and user flow name are correct.

4. Retrieve the client ID from the resource application overview page.

![b2c-client-id](media/b2c-setup/b2c-client-id.png)

### Deploy the FHIR service by using an ARM Template

Use an [ARM template](templates/fhir-service-arm-template.json) to simplify deploying the FHIR Service. Use PowerShell or Azure CLI to deploy the ARM template to an Azure Subscription.

#### [PowerShell](#tab/powershell)

- Run the code in PowerShell locally, in Visual Studio Code, or in Azure Cloud Shell, to deploy the FHIR service.

- Use `Connect-AzAccount` to sign in to Azure. Use `Get-AzContext` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

- Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `New-AzResourceGroup`.

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

#### [Azure CLI](#tab/command-line)

- Run the code locally, in Visual Studio Code or in Azure Cloud Shell, to deploy the FHIR service.

- Use `az login` to sign in to Azure. Use `az account show --output table` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

- Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `az group create`.

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

---

## Step 3: Validate Azure B2C users can access FHIR resources

To validate that the FHIR service and B2C tenant are configured properly:

- Run the [Postman](https://www.postman.com) application locally or in a web browser. Follow the instructions in [this](https://learn.microsoft.com/azure/healthcare-apis/fhir/use-postman) document to obtain the proper access to the FHIR service. When following the instructions in the [GET FHIR  resource](https://learn.microsoft.com/azure/healthcare-apis/fhir/use-postman#get-fhir-resource) section, the request returns an empty response because the FHIR service is new and doesn't have any patient resources.

- Create a patient resource in the FHIR service.

- Link the patient resource to the Azure B2C user.

- Configure Postman to obtain an access token for B2C users.

- Fetch the patient resource by using the B2C user.

### Create a patient resource in the FHIR service

It's important to note that users in the B2C tenant aren't able to create, read update, or delete any resources until the user is linked to a FHIR resource, for example as patient or practitioner. A user with the `FhirDataWriter` or `FhirDataContributor` role in the Microsoft Entra ID where the FHIR service is tenanted must perform this step.

1. Create a patient with a specific identifier by changing the method to `PUT` and executing a request to `{{fhirurl}}/Patient/1` with this body:

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

2. Verify the patient is created by changing the method back to `GET` and verifying that a request to `{{fhirurl}}/Patient` returns the newly created patient.

### Link the patient resource to the Azure B2C user

In the section :xxx: you created a user named **Test Patient1**, so the FHIR service contains a patient resource that represents **Test Patient1**. You need to create an explicit link between the user in the B2C tenant and the resource in the FHIR service. Create the link by using Extension Attributes in Microsoft Graph. A detailed explanation of these concepts can be found [here](https://learn.microsoft.com/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow).

1. Go to the B2C tenant. On the left pane, choose **App registrations**.
1. Select **All applications**.
1. Select the item with the prefix **b2c-extensions-app**.

   :::image type="content" source="media/b2c-setup/b2c-app-list.png" alt-text="Screenshot showing B2C app list" lightbox="media/b2c-setup/b2c-app-list.png":::

1. Note the Application (client) ID value.

   :::image type="content" source="media/b2c-setup/b2c-extensions-app.png" alt-text="Screenshot showing B2C extensions app" lightbox="media/b2c-setup/b2c-extensions-app.png":::

1. Navigate back to the B2C tenant home page, on the left pane select **Users**.

   :::image type="content" source="media/b2c-setup/b2c-home-user.png" alt-text="Screenshot showing B2C home user" lightbox="media/b2c-setup/b2c-home-user.png":::

1. Select **Test Patient1**.

   :::image type="content" source="media/b2c-setup/b2c-user-list.png" alt-text="Screenshot showing B2C user list" lightbox="media/b2c-setup/b2c-user-list.png":::

1. Note the **Object ID** value.

   :::image type="content" source="media/b2c-setup/b2c-user-id.png" alt-text="Screenshot showing B2C user ID" lightbox="media/b2c-setup/b2c-user-id.png":::

1. Navigate to the Microsoft Graph Explorer [https://developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/graph/graph-explorer). Sign in with a user that has the Global Administrator role for the B2C tenant. (It's a good idea to create a new Admin user in the B2C tenant to manage users in the tenant.)

   :::image type="content" source="media/b2c-setup/graph-login.png" alt-text="Screenshot showing Graph login" lightbox="media/b2c-setup/graph-login.png":::

1. Select the avatar for the user, and then choose **Consent to permissions**.

   :::image type="content" source="media/b2c-setup/graph-consent1.png" alt-text="Screenshot showing Graph consent1" lightbox="media/b2c-setup/graph-consent1.png":::

1. Scroll down to **User**. Consent to User.ReadWrite.All. This permission allows you to update the **Test Patient1** user with the `fhirUser` claim value.

   :::image type="content" source="media/b2c-setup/graph-consent2.png" alt-text="Screenshot showing Graph consent2" lightbox="media/b2c-setup/graph-consent2.png":::

1. After the consent process completes, update the user. You need the b2c-extensions-app application (client) ID and the user Object ID.

   - Change the method to `PATCH`.
   - Change the URL to [https://graph.microsoft.com/v1.0/users/{USER_OBJECT_ID}](#link-the-patient-resource-to-the-azure-b2c-user)
   - Create the `PATCH` body. A `PATCH` body is a single key-value-pair, where the key format is `extension_{B2C_EXTENSION_APP_ID_NO_HYPHENS}_fhirUser` and the value is the fully qualified FHIR resource ID for the patient ("https://{YOUR_FHIR_SERVICE}.azurehealthcareapis.com/Patient/1").

More details about formatting the extension attribute can be found [here](https://learn.microsoft.com/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow#manage-extension-attributes-through-microsoft-graph).

1. After the request is formatted, choose **Run query**. Wait for a successful response that confirms the user in the B2C tenant is linked to the patient resource in the FHIR service.

   :::image type="content" source="media/b2c-setup/graph-patch.png" alt-text="Screenshot showing Graph patch" lightbox="media/b2c-setup/graph-patch.png":::

### Configure Postman to obtain an access token for B2C users

1. Launch the Postman application and then create a new **Blank collection**. In this example, the collection is named **FHIR Patient**.

   :::image type="content" source="media/b2c-setup/postman-new-collection.png" alt-text="Screenshot showing Postman new collection" lightbox="media/b2c-setup/postman-new-collection.png":::

1. Select the **Authorization** tab in the collection overview, in the **Type** dropdown list, select **OAuth 2.0**.

   :::image type="content" source="media/b2c-setup/postman-auth.png" alt-text="Screenshot showing Postman auth" lightbox="media/b2c-setup/postman-auth.png":::

1. Scroll down to the **Configure New Token** section and add these values:

#### Callback URL

This value is configured when the B2C resource application is created.

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

This value is the application (client) ID of the [B2C resource application](/azure-b2c-setup.md#create-a-new-b2c-resource-application).

```text
{YOUR_APPLICATION_ID}
```

#### Scope

This value is defined in the B2C resource application in the **Expose an API** section. The scope granted permission is `patient.all.all`. The scope request must be a fully qualified URL (for example, [https://testb2c.onmicrosoft.com/fhir/patient.all.all](#scope)). 

1. Copy the fully qualified scope from the **Expose an API** section of the B2C resource application.

```text
{YOUR_APPLICATION_ID_URI}/patient.all.all
```

   :::image type="content" source="media/b2c-setup/postman-urls.png" alt-text="Screenshot showing Postman URLs" lightbox="media/b2c-setup/postman-urls.png":::

## Fetch the patient resource by using the B2C user

1. When the authorization configuration in Postman is set up to launch the B2C user flow, obtain an access token by choosing **Get New Access Token**.

   :::image type="content" source="media/b2c-setup/postman-get-token1.png" alt-text="Screenshot showing Postman get token1" lightbox="media/b2c-setup/postman-get-token1.png":::

1. Use the **Test Patient** credentials to sign in.

   :::image type="content" source="media/b2c-setup/postman-get-token2.png" alt-text="Screenshot showing Postman get token2" lightbox="media/b2c-setup/postman-get-token2.png":::

1. Choose **Use Token** to use the access token for any requests in the collection.

   :::image type="content" source="media/b2c-setup/postman-use-token.png" alt-text="Screenshot showing Postman use token" lightbox="media/b2c-setup/postman-use-token.png":::

1. Create a new request to search for patient resources in the FHIR service. Choose the 3 dots (...) next to the name of the collection, and then choose ***Add request**.

   :::image type="content" source="media/b2c-setup/postman-request1.png" alt-text="Screenshot showing Postman request1" lightbox="media/b2c-setup/postman-request1.png":::

1. Set the method to `GET`, enter the fully qualified FHIR service URL and then add the path `/Patient`. 
1. Choose **Send**.
1. Verify that the response contains the single patient resource.

   :::image type="content" source="media/b2c-setup/postman-request2.png" alt-text="Screenshot showing Postman request2" lightbox="media/b2c-setup/postman-request2.png":::
