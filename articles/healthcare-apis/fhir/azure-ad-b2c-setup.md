---
title: Use Azure Active Directory B2C to grant access to the FHIR service in Azure Health Data Services
description: Learn how to use Azure AD B2C with the FHIR service to enable access to healthcare applications and users.
services: healthcare-apis
author: namalu
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 01/21/2024
ms.author: namalu
---

# Use Azure Active Directory B2C to grant access to the FHIR service

Healthcare organizations can use [Azure Active Directory B2C](../../active-directory-b2c/overview.md) (Azure AD B2C) with the FHIR&reg; service in Azure Health Data Services to grant access to their applications and users. 

## Create an Azure AD B2C tenant for the FHIR service

Creating an Azure AD B2C tenant for the FHIR service sets up a secure infrastructure for managing user identities in your healthcare applications. 

If you already created an Azure AD B2C tenant, you can skip to [Deploy the FHIR service with Azure AD B2C](#deploy-the-fhir-service-with-azure-active-directory-b2c-as-the-identity-provider). 

#### Deploy an Azure AD B2C tenant by using an ARM template

Use PowerShell or Azure CLI to deploy the [ARM template](https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/b2c-arm-template.json) programmatically to an Azure subscription. For more information about syntax, properties, and usage of the template, see [Deploy an instance of Azure Active Directory B2C](/azure/templates/microsoft.azureactivedirectory/b2cdirectories?pivots=deployment-language-arm-template). 

Run the code in Azure Cloud Shell or in PowerShell locally in Visual Studio Code to deploy the FHIR service to the Azure AD B2C tenant.

#### [PowerShell](#tab/powershell)

1. Use `Connect-AzAccount` to sign in to Azure. After you sign in, use `Get-AzContext` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

1. Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `New-AzResourceGroup`.

```PowerShell
### variables
$tenantid="your tenant id"
$subscriptionid="your subscription id"
$resourcegroupname="your resource group name"
$b2cName="your b2c tenant name"

### login to azure
Connect-AzAccount -Tenant $tenantid -SubscriptionId $subscriptionid 

### create resource group
New-AzResourceGroup -Name $resourcegroupname -Location $region

### deploy the resource
New-AzResourceGroupDeployment -ResourceGroupName $resourcegroupname -TemplateUri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/b2c-arm-template.json -b2cName $b2cNa
```

#### [Azure CLI](#tab/command-line)

1. Use `Connect-AzAccount` to sign in to Azure. After you sign in, use `az account show --output table` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

1. Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `az group create`.

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
az deployment group create --resource-group $resourcegroupname --template-uri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/b2c-arm-template.json --parameters b2cName=$b2cName
```

---

#### Add a test B2C user to the Azure AD B2C tenant

You need a test B2C user to associate with a specific patient resource in the FHIR service, and to verify that the authentication flow works as expected. 

1. In the Azure portal, go to the B2C resource. Choose **Open B2C Tenant**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-resource-sml.png" alt-text="Screenshot showing a B2C resource." lightbox="media/azure-ad-b2c-setup/b2c-resource-lrg.png":::

2. On the left pane, choose **Users**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-home-user-2-sml.png" alt-text="Screenshot showing home user." lightbox="media/azure-ad-b2c-setup/b2c-home-user-2-lrg.png":::

3. Choose **+ New user**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-add-user-sml.png" alt-text="Screenshot showing adding new user." lightbox="media/azure-ad-b2c-setup/b2c-add-user-lrg.png":::

#### Link a B2C user with the `fhirUser` custom user attribute

The `fhirUser` custom user attribute is used to link a B2C user with a user resource in the FHIR service. In this example, a user named **Test Patient1** is created in the B2C tenant, and in a later step a [patient](https://www.hl7.org/fhir/patient.html) resource is created in the FHIR service. The **Test Patient1** user is linked to the patient resource by setting the `fhirUser` attribute value to the patient resource identifier. For more information about custom user attributes, see [User flow custom attributes in Azure Active Directory B2C](/azure/active-directory-b2c/user-flow-custom-attributes?pivots=b2c-user-flow).

1. On the **Azure AD B2C** page in the left pane, choose **User attributes**.

1. Choose **+ Add**.

1. In the **Name** field, enter **fhirUser** (case-sensitive).

1. From the **Data Type** dropdown list, select **String**.

1. Choose **Create**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-attribute.png" alt-text="Screenshot showing B2C attribute." lightbox="media/azure-ad-b2c-setup/b2c-attribute.png":::

#### Create a new B2C user flow

User flows define the sequence of steps users must follow to sign in. In this example, a user flow is defined so that when a user signs in, the access token provided includes the `fhirUser` claim. For more information, see [Create user flows and custom policies in Azure Active Directory B2C](../../active-directory-b2c/tutorial-create-user-flows.md).

1. On the **Azure AD B2C** page in the left pane, choose **User flows**.

1. Choose **+ New user flow**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-user-flow-sml.png" alt-text="Screenshot showing B2C user flow." lightbox="media/azure-ad-b2c-setup/b2c-user-flow-lrg.png":::

1. Give the user flow a name unique to the B2C tenant. (The name doesn't have to be globally unique.) In this example, the name of the user flow is **USER_FLOW_1**. Make note of the name.

1. Make sure **Email signin** is enabled for local accounts so that the test user can sign in and obtain an access token for the FHIR service.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-user-flow-config-1-sml.png" alt-text="Screenshot showing B2C user flow configuration." lightbox="media/azure-ad-b2c-setup/b2c-user-flow-config-1-lrg.png":::

1. On the **Create a user flow** page, scroll to section **5. Application Claims**, and then select **Show more...** to show a list of all available claims. 

1. Select the **fhirUser** claim. 

1. Choose **Ok**. 

1. Choose **Create**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-user-flow-config-2.png" alt-text="Screenshot showing B2C user flow configuration with FHIR user claim." lightbox="media/azure-ad-b2c-setup/b2c-user-flow-config-2.png":::

#### Create a new B2C resource application

The B2C resource application handles authentication requests from your healthcare application to Azure Active Directory B2C. 

1. On the **Azure AD B2C** page in the left pane, choose **App registrations**.

1. Choose **+ New registration**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-new-application-sml.png" alt-text="Screenshot showing B2C new application." lightbox="media/azure-ad-b2c-setup/b2c-new-application-lrg.png":::

1. Enter a display name. This example uses **FHIR Service**.

1. In the **Supported account types** list, choose **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.

1. In the **Redirect URI (recommended)** drop-down list, select ***Public client/native (mobile & desktop)**. Populate the value with the [Postman](https://www.postman.com) callback URI [https://oauth.pstmn.io/v1/callback](#create-a-new-b2c-resource-application). The callback URI is for testing purposes.

1. In the **Permissions** section, select **Grant admin consent to openid and offline_access permissions**.

1. Choose **Register**. Wait for the application registration to complete. The browser automatically navigates to the application **Overview** page.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-application-register.png" alt-text="Screenshot showing B2C application register." lightbox="media/azure-ad-b2c-setup/b2c-application-register.png":::

#### Configure API permissions for the app 
1. On the **App registrations page** in the left pane, choose **Manifest**. 

1. Scroll until you find the `oauth2Permissions` array. Replace the array with one or more values in the [oauth2Permissions.json](https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/oauth2Permissions.json) file. Copy the entire array or individual permissions. 
 
   If you add a permission to the list, any user in the B2C tenant can obtain an access token with the API permission. If a level of access isn't appropriate for a user within the B2C tenant, don't add to the array because there isn't a way to limit permissions to a subset of users.

1. After the **oauth2Permissions** array is populated, choose **Save**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-application-manifest.png" alt-text="Screenshot showing B2C application manifest." lightbox="media/azure-ad-b2c-setup/b2c-application-manifest.png":::

#### Expose the web API and assign an application ID URI

1. On the **App registrations page** in the left pane, choose **Expose an API**. 

1. Choose **Add**. 

1. By default, the **Application ID URI** field is populated with the application (client) ID. Change the value if desired. In this example, the value is **fhir**.

1. Choose **Save**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-application-api.png" alt-text="Screenshot showing B2C application API." lightbox="media/azure-ad-b2c-setup/b2c-application-api.png":::

1. On the **App registrations page** in the left pane, choose **API permissions**.

1. Choose  **+ Add a permission**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-api-permission-1-sml.png" alt-text="Screenshot showing B2C API permission." lightbox="media/azure-ad-b2c-setup/b2c-api-permission-1-lrg.png":::

1. On the **Request API permissions** pane, select **APIs my organization uses**.

1. Select the resource application from the list.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-api-permission-2-sml.png" alt-text="Screenshot showing B2C API permissions with APIs used." lightbox="media/azure-ad-b2c-setup/b2c-api-permission-2-lrg.png":::

1. On the **Request API permissions** pane in the **Patient** section, select at least one permission. In this example, the permission `patient.all.read` is selected, which means a user that requests an access token with the scope `patient.all.read` has Read privileges (patient.all.**read**) for all FHIR resources (patient.**all**.read) in the Patient compartment (**patient**.all.read) For more information, see [Patient compartment](https://build.fhir.org/compartmentdefinition-patient.html).

1. Choose **Add permissions**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-api-permission-3.png" alt-text="Screenshot showing B2C API permissions with permissions added." lightbox="media/azure-ad-b2c-setup/b2c-api-permission-3.png":::

1. On the **API permissions** page in the **Configured permissions** section, choose **Grant admin consent**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-api-permission-4-sml.png" alt-text="Screenshot showing B2C API permissions for admin consent." lightbox="media/azure-ad-b2c-setup/b2c-api-permission-4-lrg.png":::

## Deploy the FHIR service with Azure Active Directory B2C as the identity provider

Deploying the FHIR service with Azure Active Directory B2C as the identity provider allows the FHIR service to authenticate users based on their Azure AD B2C credentials, ensuring that only authorized users can access sensitive patient information

#### Obtain the B2C authority and client ID 

Use the **authority** and **client ID** (or application ID) parameters to configure the FHIR service to use an Azure AD B2C tenant as an identity provider.

1. Create the authority string by using the name of the B2C tenant and the name of the user flow.

   ```http
   https://<YOUR_B2C_TENANT_NAME>.b2clogin.com/<YOUR_B2C_TENANT_NAME>.onmicrosoft.com/<YOUR_USER_FLOW_NAME>/v2.0
   ```

2. Test the authority string by making a request to the `.well-known/openid-configuration` endpoint. Enter the string into a browser to confirm it navigates to the OpenId Configuration JSON file. If the OpenId Configuration JSON fails to load, make sure the B2C tenant name and user flow name are correct.
  
   ```http
   https://<YOUR_B2C_TENANT_NAME>.b2clogin.com/<YOUR_B2C_TENANT_NAME>.onmicrosoft.com/<YOUR_USER_FLOW_NAME>/v2.0/.well-known/openid-configuration
   ```

3. Retrieve the client ID from the resource application overview page.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-client-id-sml.png" alt-text="Screenshot showing B2C application overview page." lightbox="media/azure-ad-b2c-setup/b2c-client-id-lrg.png":::

#### Deploy the FHIR service by using an ARM Template

Use an [ARM template](https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/fhir-service-arm-template.json) to simplify deploying the FHIR service. Use PowerShell or Azure CLI to deploy the ARM template to an Azure subscription.

Run the code in Azure Cloud Shell or in PowerShell locally in Visual Studio Code to deploy the FHIR service to the Azure AD B2C tenant.

#### [PowerShell](#tab/powershell)

1. Use `Connect-AzAccount` to sign in to Azure. Use `Get-AzContext` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

1. Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `New-AzResourceGroup`.

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
New-AzResourceGroupDeployment -ResourceGroupName $resourcegroupname -TemplateUri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/fhir-service-arm-template.json -tenantid $tenantid -region $region -workspaceName $workspacename -fhirServiceName $fhirservicename -smartAuthorityUrl $smartAuthorityUrl -smartClientId $smartClientId
```

#### [Azure CLI](#tab/command-line)

1. Use `az login` to sign in to Azure. Use `az account show --output table` to verify the subscription and tenant you want to use. Change the subscription and tenant if needed.

1. Create a new resource group, or use an existing one by skipping the step or commenting out the line starting with `az group create`.

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
az deployment group create --resource-group $resourcegroupname --template-uri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/fhir-service-arm-template.json --parameters tenantid=$tenantid region=$region workspaceName=$workspacename fhirServiceName=$fhirservicename smartAuthorityUrl=$smartAuthorityUrl storageAccountConfirm=$smartClientId
```

---

## Validate Azure AD B2C users are able to access FHIR resources

The validation process involves creating a patient resource in the FHIR service, linking the patient resource to the Azure AD B2C user, and configuring Postman to get an access token for B2C users. After the validation process is complete, you can fetch the patient resource by using the B2C test user.

#### Run Postman to get an access token

Run the [Postman](https://www.postman.com) application locally or in a web browser. For steps to obtain the proper access to the FHIR service, see [Access the FHIR service using Postman](use-postman.md).

When you follow the steps to [GET FHIR resource](use-postman.md#get-the-fhir-resource) section, the request returns an empty response because the FHIR service is new and doesn't have any patient resources.

#### Create a patient resource in the FHIR service

It's important to note that users in the B2C tenant aren't able to read any resources until the user is linked to a FHIR resource, for example as patient or practitioner. A user with the `FhirDataWriter` or `FhirDataContributor` role in the Microsoft Entra ID where the FHIR service is tenanted must perform this step.

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

#### Link the patient resource to the Azure AD B2C user

You need to create an explicit link between the test user in the B2C tenant and the resource in the FHIR service. Create the link by using Extension Attributes in Microsoft Graph. For more information, see [Define custom attributes in Azure Active Directory B2C](../../active-directory-b2c/user-flow-custom-attributes.md).

1. Go to the B2C tenant. On the left pane, choose **App registrations**.

1. Select **All applications**.

1. Select the application with the prefix **b2c-extensions-app**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-app-list-sml.png" alt-text="Screenshot showing B2C app list." lightbox="media/azure-ad-b2c-setup/b2c-app-list-lrg.png":::

1. Note the Application (client) ID value.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-extensions-app-sml.png" alt-text="Screenshot showing B2C extensions app." lightbox="media/azure-ad-b2c-setup/b2c-extensions-app-lrg.png":::

1. Navigate back to the B2C tenant home page, on the left pane select **Users**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-home-user-5-sml.png" alt-text="Screenshot showing B2C home user." lightbox="media/azure-ad-b2c-setup/b2c-home-user-5-lrg.png":::

1. Select **Test Patient1**.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-user-list-sml.png" alt-text="Screenshot showing B2C user list." lightbox="media/azure-ad-b2c-setup/b2c-user-list-lrg.png":::

1. Note the **Object ID** value.

   :::image type="content" source="media/azure-ad-b2c-setup/b2c-user-id-sml.png" alt-text="Screenshot showing B2C user ID." lightbox="media/azure-ad-b2c-setup/b2c-user-id-lrg.png":::

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer). Sign in with a user assigned to the Global Administrator role for the B2C tenant. (It's a good idea to create a new admin user in the B2C tenant to manage users in the tenant.)

   :::image type="content" source="media/azure-ad-b2c-setup/graph-login-sml.png" alt-text="Screenshot showing Graph login." lightbox="media/azure-ad-b2c-setup/graph-login-lrg.png":::

1. Select the avatar for the user, and then choose **Consent to permissions**.

   :::image type="content" source="media/azure-ad-b2c-setup/graph-consent-1-sml.png" alt-text="Screenshot showing Graph consent for test user." lightbox="media/azure-ad-b2c-setup/graph-consent-1-lrg.png":::

1. Scroll to **User**. Consent to User.ReadWrite.All. This permission allows you to update the **Test Patient1** user with the `fhirUser` claim value.

   :::image type="content" source="media/azure-ad-b2c-setup/graph-consent-2.png" alt-text="Screenshot showing Graph consent for fhirUser claim." lightbox="media/azure-ad-b2c-setup/graph-consent-2.png":::

1. After the consent process completes, update the user. You need the b2c-extensions-app application (client) ID and the user Object ID.

   - Change the method to `PATCH`.
   
   - Change the URL to [https://graph.microsoft.com/v1.0/users/{USER_OBJECT_ID}](#link-the-patient-resource-to-the-azure-ad-b2c-user).
   
   - Create the `PATCH` body. A `PATCH` body is a single key-value-pair, where the key format is `extension_{B2C_EXTENSION_APP_ID_NO_HYPHENS}_fhirUser` and the value is the fully qualified FHIR resource ID for the patient `https://{YOUR_FHIR_SERVICE}.azurehealthcareapis.com/Patient/1"`.

   For more information, see [Manage extension attributes through Microsoft Graph](../../active-directory-b2c/user-flow-custom-attributes.md).

1. After the request is formatted, choose **Run query**. Wait for a successful response that confirms the user in the B2C tenant is linked to the patient resource in the FHIR service.

   :::image type="content" source="media/azure-ad-b2c-setup/graph-patch-sml.png" alt-text="Screenshot showing Graph patch." lightbox="media/azure-ad-b2c-setup/graph-patch-lrg.png":::

#### Configure Postman to obtain an access token for B2C users

Obtain an access token to test the authentication flow.

1. Launch the Postman application, and then create a new **Blank collection**. In this example, the collection is named **FHIR Patient**.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-new-collection-sml.png" alt-text="Screenshot showing Postman new collection." lightbox="media/azure-ad-b2c-setup/postman-new-collection-lrg.png":::

1. Select the **Authorization** tab in the collection overview.

1. In the **Type** dropdown list, select **OAuth 2.0**.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-auth.png" alt-text="Screenshot showing Postman auth." lightbox="media/azure-ad-b2c-setup/postman-auth.png":::

1. Scroll to the **Configure New Token** section and enter these values:

   - **Callback URL**. This value is configured when the B2C resource application is created.

      ```http
      https://oauth.pstmn.io/v1/callback
      ```

   - **Auth URL**. This value can be created using the name of the B2C tenant and the name of the user flow.

      ```http
      https://{YOUR_B2C_TENANT_NAME}.b2clogin.com/{YOUR_B2C_TENANT_NAME}.onmicrosoft.com/{YOUR_USER_FLOW_NAME}/oauth2/v2.0/authorize
      ```

   - **Access Token URL**. This value can be created using the name of the B2C tenant and the name of the user flow.

      ```http
      https://{YOUR_B2C_TENANT_NAME}.b2clogin.com/{YOUR_B2C_TENANT_NAME}.onmicrosoft.com/{YOUR_USER_FLOW_NAME}/oauth2/v2.0/token
      ```

   - **Client ID**. This value is the application (client) ID of the B2C resource application.

      ```http
      {YOUR_APPLICATION_ID}
      ```

   - **Scope**. This value is defined in the B2C resource application in the **Expose an API** section. The scope granted permission is `patient.all.read`. The scope request must be a fully qualified URL, for example, `https://testb2c.onmicrosoft.com/fhir/patient.all.read`. 

1. Copy the fully qualified scope from the **Expose an API** section of the B2C resource application.

      ```http
      {YOUR_APPLICATION_ID_URI}/patient.all.read
      ```

   :::image type="content" source="media/azure-ad-b2c-setup/postman-urls.png" alt-text="Screenshot showing Postman URLs." lightbox="media/azure-ad-b2c-setup/postman-urls.png":::

#### Fetch the patient resource by using the B2C user

Verify that Azure AD B2C users can access FHIR resources.

1. When the authorization configuration in Postman is set up to launch the B2C user flow, choose **Get New Access Token** to get an access token.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-get-token-3.png" alt-text="Screenshot showing Postman get access token." lightbox="media/azure-ad-b2c-setup/postman-get-token-3.png":::

1. Use the **Test Patient** credentials to sign in.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-get-token-2.png" alt-text="Screenshot showing Postman get token." lightbox="media/azure-ad-b2c-setup/postman-get-token-2.png":::

1. Choose **Use Token** to use the access token for any requests in the collection.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-use-token.png" alt-text="Screenshot showing Postman use token." lightbox="media/azure-ad-b2c-setup/postman-use-token.png":::

1. Create a new request to search for patient resources in the FHIR service. Select the ellipsis button (...) next to the name of the collection, and then choose **Add request**.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-request-1-sml.png" alt-text="Screenshot showing Postman request added." lightbox="media/azure-ad-b2c-setup/postman-request-1-lrg.png":::

1. Set the method to `GET`, enter the fully qualified FHIR service URL, and then add the path `/Patient`. 

1. Choose **Send**.

1. Verify that the response contains the single patient resource.

   :::image type="content" source="media/azure-ad-b2c-setup/postman-request-2.png" alt-text="Screenshot showing Postman request response." lightbox="media/azure-ad-b2c-setup/postman-request-2.png":::

## Next steps

[Configure multiple identity providers](configure-identity-providers.md)

[Troubleshoot identity provider configuration](troubleshoot-identity-provider-configuration.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]