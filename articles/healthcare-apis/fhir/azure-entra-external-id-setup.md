---
title: Use Microsoft Entra External ID to access the FHIR service
description: Learn how to use Microsoft Entra External ID with the FHIR service in Azure Health Data Services to enable access for healthcare applications and users.
services: healthcare-apis
author: maheshkopparthiwct
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.date: 05/22/2026
ms.author: evach
ai-usage: ai-assisted
---

# Use Microsoft Entra External ID to access the FHIR service

Healthcare organizations can use [Microsoft Entra External ID](/entra/external-id/external-identities-overview) with the FHIR&reg; service in Azure Health Data Services to grant access to their applications and users. 

## Create a Microsoft Entra External ID tenant for the FHIR service

Creating a Microsoft Entra External ID tenant for the FHIR service sets up a secure infrastructure for managing user identities in your healthcare applications. 

If you already created a Microsoft Entra External ID tenant, you can skip to 
[Add a test user to the Microsoft Entra External ID tenant](#add-a-test-user-to-the-microsoft-entra-external-id-tenant).

Use PowerShell or Azure CLI to deploy the [ARM template](https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-entra-external/entra-external-arm-template.json) to deploy a Microsoft Entra external ID tenant programmatically to an Azure subscription. For more information about syntax, properties, and usage of the template, see [Deploy an instance of Microsoft Entra External ID](/azure/templates/microsoft.azureactivedirectory/ciamdirectories?pivots=deployment-language-arm-template).

Run the code in Azure Cloud Shell, or locally in PowerShell, Azure CLI, or Visual Studio Code to deploy the FHIR service to the Microsoft Entra External ID tenant.

# [PowerShell](#tab/powershell-script)

Use the following PowerShell script to deploy a Microsoft Entra External ID tenant. Make sure to replace the variables in the script with your own values before running it. Don't include `.onmicrosoft.com` in the `directoryName` variable.

The following script signs in to Azure, creates a resource group, and deploys the ARM template that creates a Microsoft Entra External ID tenant. If you want to use an existing resource group, skip the "create resource group" step, or comment out the line starting with `New-AzResourceGroup`. 

If you are using a locally stored ARM template, replace the `-TemplateUri` parameter with `-TemplateFile` and provide the local path to the ARM template JSON file.

Replace the \<placeholder\> values in the script with your actual Azure subscription details and desired configuration.

```powershell
### variables
$tenantid="<your tenant id>"
$subscriptionid="<your subscription id>"
$resourceGroupName="<your resource group name>"
$location="<your desired location>"
$directoryName="<your entra external id tenant name>"

### login to azure
Connect-AzAccount -Tenant $tenantid -SubscriptionId $subscriptionid 

# create the resource group
New-AzResourceGroup -Name $resourceGroupName -Location $location

# deploy the resource
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/refs/heads/main/samples/fhir-aad-entra-external/entra-external-arm-template.json -directoryName $directoryName
```

# [Azure CLI](#tab/command-line-script)

Use the following Azure CLI script to deploy a Microsoft Entra External ID tenant. Make sure to replace the variables in the script with your own values before running it. Don't include `.onmicrosoft.com` in the `directoryName` variable.

The following script signs in to Azure, creates a resource group, and deploys the ARM template that creates a Microsoft Entra External ID tenant. If you want to use an existing resource group, skip the "create resource group" step, or comment out the line starting with `az group create`. 

If you're using a locally stored ARM template, replace the `--template-uri` parameter with `--template-file` and provide the local path to the ARM template JSON file.

Replace the \<placeholder\> values in the script with your actual Azure subscription details and desired configuration.

```azurecli
# variables
tenantid=<your tenant id>
subscriptionid=<your subscription id>
resourceGroupName=<your resource group name>
region=<your desired region>
directoryName=<your directory name>

# login to azure
az login
az account show --output table
az account set --subscription $subscriptionid

# create resource group
az group create --name $resourceGroupName --location $region

# deploy the resource
az deployment group create --resource-group $resourceGroupName --template-uri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/refs/heads/main/samples/fhir-aad-entra-external/entra-external-arm-template.json  --parameters directoryName=$directoryName
```

---

## Add a test user to the Microsoft Entra External ID tenant

>[!Note] 
>You're asked to set up multi-factor authentication (MFA) when signing in for the first time.

You need a test user in your Microsoft Entra External ID tenant to associate with a specific patient resource in the FHIR service and to verify that the authentication flow works as expected.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 

1. If you have access to multiple tenants, use the **Settings** icon ![Admin center settings icon.](media/azure-entra-external-id-setup/admin-center-settings-icon.png) in the top menu to switch to your external tenant from the **Directories + subscriptions** menu. Here you're asked for MFA setup.

1. In the **Users** section of the Microsoft Entra admin center, select **+ New user**, and then choose **Create new user**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user.png" alt-text="Screenshot of the test user creation page in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-user.png":::

1. On the **Basics** tab, enter the **User principal name** and **Display name**, and then select **Review + create**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user-create.png" alt-text="Screenshot of the Create new user pane in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-user-create.png":::

1. Review the information you entered to validate the input, and then select **Create** to create the user.

### Link a Microsoft Entra External ID user with the `fhirUser` custom user attribute

Use the `fhirUser` custom user attribute to link a user in Microsoft Entra External ID with a corresponding patient resource in the FHIR service. In this example, you create a user named **Test Patient1** in the Microsoft Entra External ID tenant. In a later step, you create a [patient](https://www.hl7.org/fhir/patient.html) resource in the FHIR service. You associate the **Test Patient1** user with the patient resource by setting the `fhirUser` attribute to the patient's FHIR resource identifier. For more information about custom attributes in Microsoft Entra External ID, see  
[User flow custom attributes in Microsoft Entra External ID](/entra/external-id/customers/how-to-define-custom-attributes#create-custom-user-attributes).

1. In the Microsoft Entra admin center, go to **Entra ID** > **External Identities** in the left pane.

1. Select **Custom user attributes**. 

1. Select **+ Add**.

1. In **Add custom attribute**:

   1. In the **Name** field, enter **fhirUser** (case-sensitive).

   1. From the **Data Type** dropdown list, select **String**.

   1. In the **Description** field, enter a description for the custom attribute. For example, "The fully qualified FHIR resource ID associated with the user. (for example, Patient Resource)".

   1. Select **Create**.

    :::image type="content" source="media/azure-entra-external-id-setup/entra-external-custom-user-attributes.png" alt-text="Screenshot of the creation of fhirUser custom attribute in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-custom-user-attributes.png":::

### Create a new user flow in Microsoft Entra External ID

User flows define the sequence of steps users must follow to sign in. In this example, you define a user flow so that when a user signs in, the access token includes the `fhirUser` claim. For more information, see [Create user flows and custom policies in Microsoft Entra External ID](/entra/external-id/customers/how-to-user-flow-sign-up-sign-in-customers#create-and-customize-a-user-flow).

1. On **Entra ID** > **External Identities**, select **User flows**.

1. Select **+ New user flow**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user-flow.png" alt-text="Screenshot of the creation of a new user flow in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-user-flow.png":::

1. Enter a name for the user flow that's unique to the Microsoft Entra External ID tenant. The name doesn't need to be globally unique. In this example, the user flow name is **USER_FLOW_1**. Make note of the name.

1. Under **Identity providers**, keep **Email with password** selected (default).

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user-flow-config-1.png" alt-text="Screenshot of Microsoft Entra External ID user flow configuration." lightbox="media/azure-entra-external-id-setup/entra-external-user-flow-config-1.png":::

1. Under **User attributes**, select **Show more** to view more attributes.

1. Select **fhirUser**.

1. Select **Ok**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user-flow-config-2.png" alt-text="Screenshot of user flow configuration and selection of fhirUser attribute in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-user-flow-config-2.png":::

1. Select **Create**.


## Create a Microsoft Entra External Resource Application

The Microsoft Entra External ID resource application handles authentication requests from your healthcare application to Microsoft Entra External ID.

1. In the **Microsoft Entra admin** center, go to **Entra ID** > **App registrations**.

1. Select **+ New registration**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-new-app-registration.png" alt-text="Screenshot of Microsoft Entra External ID new application." lightbox="media/azure-entra-external-id-setup/entra-external-new-app-registration.png":::

1. In **Register an application**:

   - Enter a display name. This example uses **FHIR Service**.

   - In the **Redirect URI (recommended)** drop-down list, select **Public client/native (mobile & desktop)**. Enter the callback URI. This callback URI is for testing purposes.

   - Select **Register**. Wait for the application registration to complete. The browser automatically navigates to the application **Overview** page.

    :::image type="content" source="media/azure-entra-external-id-setup/entra-external-application-register.png" alt-text="Screenshot of the application registration page in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-application-register.png":::

### Configure API permissions for the app

1. In the left pane, select **App registrations**, select the application you registered, and then select **Manifest**.

1. Scroll until you find the `oauth2PermissionScopes` array in the json code in **Microsoft Graph App Manifest (New)**. Replace the array with one or more values from the [`oauth2Permissions.json`](https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/oauth2Permissions.json) file. You can copy the entire array or individual permissions.

  If you add a permission to the list, any user in the **Microsoft Entra External ID** tenant can get an access token with that API permission. 
  
  If a permission level isn't appropriate for all users, don't include it in the permission array. For example, the `patient.all.read` permission grants read access to all patient resources in the FHIR service. If you don't want all users to have this level of access, don't include `patient.all.read` in the `oauth2PermissionScopes` array.

1. In the same manifest, set the `acceptMappedClaims` property to `true`. This setting enables the app to receive custom claims, like `fhirUser` in the token.

1. Select **Save**.

    :::image type="content" source="media/azure-entra-external-id-setup/entra-external-application-manifest.png" alt-text="Screenshot of the oauth2PermissionScopes array being edited in the app manifest." lightbox="media/azure-entra-external-id-setup/entra-external-application-manifest.png":::

### Expose the web API and assign an application ID URI

1. On **App registrations** select the application you registered, and then select **Expose an API**.

1. For the **Application ID URI** section, select **Add**.

1. By default, the **Application ID** URI field is populated with the application (client) ID. Change the value if desired.

1. Select **Save**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-application-api.png" alt-text="Screenshot of the Application ID URI being set in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-application-api.png":::

1. Select **API permissions** and then select **+ Add a permission**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-api-permission-1.png" alt-text="Screenshot of Microsoft Entra External ID API permission." lightbox="media/azure-entra-external-id-setup/entra-external-api-permission-1.png":::


1. On **Request API permissions**, select **APIs my organization uses**.

1. Select the resource application from the list. For this example, select the application you registered in the previous section with the name **FHIR Service**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-api-permission-2.png" alt-text="Screenshot of Microsoft Entra External ID API permissions with APIs used." lightbox="media/azure-entra-external-id-setup/entra-external-api-permission-2.png":::


1. Enter `Patient` in the search box to filter the permissions list to show only permissions related to patient resources in the FHIR service.

1. In the **Patient** section, select at least one permission. In this example, the permission `patient.all.read` is selected, which means a user that requests an access token with the scope `patient.all.read` has Read privileges (patient.all.**read**) for all FHIR resources (patient.**all**.read) in the Patient compartment (**patient**.all.read) For more information, see [Patient compartment](https://build.fhir.org/compartmentdefinition-patient.html).

1. Select **Add permissions**.

    :::image type="content" source="media/azure-entra-external-id-setup/entra-external-api-permission-3.png" alt-text="Screenshot of Microsoft Entra External ID API permissions with permissions added." lightbox="media/azure-entra-external-id-setup/entra-external-api-permission-3.png":::

1. On **API permissions** in the **Configured permissions** section, select **Grant admin consent**.


   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-api-permission-4.png" alt-text="Screenshot of Microsoft Entra External ID API permissions for admin consent." lightbox="media/azure-entra-external-id-setup/entra-external-api-permission-4.png":::

## Configure Single sign-on (Preview) for the app

1. Go to **Entra External ID** > **Enterprise apps**.

1. Select your registered application from the list.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-1.png" alt-text="Screenshot of the Enterprise applications page in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-1.png":::

1. In your application’s pane, under **Manage**, select **Single sign-on (Preview)**.

1. In the **Attributes & Claims** section, select **Edit** to configure the single sign-on settings.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-2.png" alt-text="Screenshot of the Single sign-on (Preview) configuration page in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-2.png":::

1. Under **Attributes & Claims**, select **+ Add new claim**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-3.png" alt-text="Screenshot of the Add new claim page in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-3.png":::

1. Configure the new claim:

   1. **Name**: `fhirUser`

   1. **Source**: Select **Directory schema extension**

   1. **Source attribute**: Select **b2c-extensions-app**

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-4.png" alt-text="Screenshot of the manage claim configuration in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-4.png":::

1. Select **Select**. This action opens the **Add Extension Attributes** window.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-5.png" alt-text="Screenshot of the select application configuration in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-5.png":::

1. In the list, select the **user.fhirUser** attribute.

1. Select **Add** to include the attribute in the claim.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-6.png" alt-text="Screenshot of selection of the user.fhirUser attribute during claim configuration in Microsoft Entra External ID." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-6.png":::

1. Select **Save**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-enterprise-apps-7.png" alt-text="Screenshot of the saved fhirUser claim in the directory extension schema." lightbox="media/azure-entra-external-id-setup/entra-external-enterprise-apps-7.png":::

## Deploy the FHIR service with Microsoft Entra External ID as the identity provider

When you deploy the FHIR service with Microsoft Entra External ID as the identity provider, the FHIR service authenticates users by using their Microsoft Entra External ID credentials. This authentication method ensures that only authorized users can access sensitive patient information.

### Get the Microsoft Entra External ID authority and client ID 

Use the **authority** and **client ID** (or application ID) parameters to configure the FHIR service to use a Microsoft Entra External ID tenant as an identity provider.

1. Create the authority string by using the name of the Microsoft Entra External ID tenant and the name of the user flow. Replace your tenant name and tenant ID in the following URL.

   ```http
   https://<your-external-id-tenant-name>.ciamlogin.com/<your-external-id-tenant-id>/v2.0
   ```

1. Test the authority string by making a request to the `.well-known/openid-configuration` endpoint. Enter the string into a browser to confirm it navigates to the OpenId Configuration JSON file. If the OpenId Configuration JSON fails to load, make sure the Microsoft Entra External ID tenant name and Microsoft Entra External ID tenant ID are correct. Replace your tenant name and tenant ID in the following URL.
  
   ```http
   https://<your-external-id-tenant-name>.ciamlogin.com/<your-external-id-tenant-id>/v2.0/.well-known/openid-configuration
   ```

1. Retrieve the client ID from the resource application overview page.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-client-id.png" alt-text="Screenshot of the Application (client) ID overview page." lightbox="media/azure-entra-external-id-setup/entra-external-client-id.png":::

### Deploy the FHIR service by using an ARM template

To simplify deploying the FHIR service, use an [ARM template](https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/main/samples/fhir-aad-b2c/fhir-service-arm-template.json). Use PowerShell or Azure CLI to deploy the ARM template to your Azure subscription. 


# [PowerShell](#tab/powershell)

Use the following PowerShell script to deploy the FHIR service with Microsoft Entra External ID as the identity provider. Set the `$smartAuthorityUrl` variable to the authority string you created in the previous section, and set the `$smartClientId` variable to the client ID of the resource application you created in your external ID tenant.

The following script signs in to Azure, creates a resource group, and deploys the ARM template that creates the FHIR service with Microsoft Entra External ID as the identity provider. If you want to use an existing resource group, skip the "create resource group" step, or comment out the line starting with `New-AzResourceGroup`.

If you are using a locally stored ARM template, replace the `-TemplateUri` parameter with `-TemplateFile` and provide the local path to the ARM template JSON file.

Replace the \<placeholder\> values in the script with your actual Azure subscription details and desired configuration for the FHIR service deployment.

```powershell
### variables
$tenantid="<your tenant id>"
$subscriptionid="<your subscription id>"
$resourcegroupname="<your resource group name>"
$region="<your desired region>"
$workspacename="<your workspace name>"
$fhirServiceName="<your fhir service name>"
$smartAuthorityUrl="<your authority>"
$smartClientId="<your client id>"

### Login to Azure
Connect-AzAccount

#Connect-AzAccount SubscriptionId $subscriptionid
Set-AzContext -Subscription $subscriptionid
Connect-AzAccount -Tenant $tenantid -SubscriptionId $subscriptionid

### create resource group
New-AzResourceGroup -Name $resourcegroupname -Location $region

### deploy the resource
New-AzResourceGroupDeployment -ResourceGroupName $resourcegroupname -TemplateUri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/refs/heads/main/samples/fhir-aad-b2c/fhir-service-arm-template.json -tenantid $tenantid -region $region -workspaceName $workspacename -fhirServiceName $fhirservicename -smartAuthorityUrl $smartAuthorityUrl -smartClientId $smartClientId
```

# [Azure CLI](#tab/command-line)

Use the following Azure CLI script to deploy the FHIR service with Microsoft Entra External ID as the identity provider. Make sure to replace the variables in the script with your own values before running it. The `smartAuthorityUrl` variable should be set to the authority string you created in the previous section, and the `smartClientId` variable should be set to the client ID of the resource application you created in your external ID tenant.

The following script signs in to Azure, creates a resource group, and deploys the ARM template that creates the FHIR service with Microsoft Entra External ID as the identity provider. If you want to use an existing resource group, skip the "create resource group" step, or comment out the line starting with `az group create`.

If you're using a locally stored ARM template, replace the `--template-uri` parameter with `--template-file` and provide the local path to the ARM template JSON file.

Replace the \<placeholder\> values in the script with your actual Azure subscription details and desired configuration for the FHIR service deployment.

```azurecli
### variables
tenantid=<your tenant id>
subscriptionid=<your subscription id>
resourcegroupname=<your resource group name>
region=<your desired region>
workspacename=<your workspace name>
fhirServiceName=<your fhir service name>
smartAuthorityUrl=<your authority>
smartClientId=<your client id>

### login to azure
az login
az account show --output table
az account set --subscription $subscriptionid

### create resource group
az group create --name $resourcegroupname --location $region

### deploy the resource
az deployment group create --resource-group $resourcegroupname --template-uri https://raw.githubusercontent.com/Azure-Samples/azure-health-data-and-ai-samples/refs/heads/main/samples/fhir-aad-b2c/fhir-service-arm-template.json --parameters tenantid=$tenantid region=$region workspaceName=$workspacename fhirServiceName=$fhirservicename smartAuthorityUrl=$smartAuthorityUrl smartClientId=$smartClientId
```

---

## Validate Microsoft Entra External ID users can access FHIR resources

The validation process involves creating a patient resource in the FHIR service, linking the patient resource to the Microsoft Entra External ID user, and configuring REST Client to get an access token for External ID users. After the validation process is complete, you can fetch the patient resource by using the External ID test user.

### Use REST Client to get an access token

For steps to obtain the proper access to the FHIR service, see [Access the FHIR service using REST Client](using-rest-client.md).

When you follow the steps in the [Get the FHIR patient data](using-rest-client.md#get-fhir-patient-data) section, the request returns an empty response because the FHIR service is new and doesn't have any patient resources.

### Create a patient resource in the FHIR service

Users in the Microsoft Entra External ID tenant can't read any resources until you link the user (such as a patient or practitioner) to a FHIR resource. A user with the `FhirDataWriter` or `FhirDataContributor` role in the Microsoft Entra ID where the FHIR service is tenanted must perform this step.

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

1. Verify the patient is created by changing the method back to `GET` and verifying that a request to `{{fhirurl}}/Patient` returns the newly created patient.

### Link the patient resource to Microsoft Entra External ID User 

Create an explicit link between the test user in the **Microsoft Entra External ID** tenant and the resource in the FHIR service. Use **extension attributes** in Microsoft Graph to define this link. For more information, see [Create custom user attributes in Microsoft Entra External ID](/entra/external-id/customers/how-to-define-custom-attributes#create-custom-user-attributes).

1. Go to the Microsoft Entra External ID tenant. On the left pane, choose **App registrations**.

1. Select **All applications**.

1. Select the application with the prefix **b2c-extensions-app**. 

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-app-list.png" alt-text="Screenshot of Microsoft Entra External ID app list." lightbox="media/azure-entra-external-id-setup/entra-external-app-list.png":::

1. Note the Application (client) ID value.

   :::image type="content" source="media/azure-entra-external-id-setup/b2c-extensions-app.png" alt-text="Screenshot of Microsoft Entra External ID extensions app." lightbox="media/azure-entra-external-id-setup/b2c-extensions-app.png":::

1. Navigate back to the Microsoft Entra External ID tenant home page, on the left pane select **Users**.

1. Under **Users > All users**, select **Test Patient1**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user-list.png" alt-text="Screenshot of Microsoft Entra External ID user list." lightbox="media/azure-entra-external-id-setup/entra-external-user-list.png":::

1. Note the **Object ID**.

   :::image type="content" source="media/azure-entra-external-id-setup/entra-external-user-id.png" alt-text="Screenshot of Microsoft Entra External ID user ID." lightbox="media/azure-entra-external-id-setup/entra-external-user-id.png":::

1. Open [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) Sign in with a user assigned to the Global Administrator role for the Microsoft Entra External ID tenant. (It's a good idea to create a new admin user in the Microsoft Entra tenant to manage users.)

   :::image type="content" source="media/azure-entra-external-id-setup/graph-login.png" alt-text="Screenshot of Graph sign in." lightbox="media/azure-entra-external-id-setup/graph-login.png":::

1. Select the avatar for the user, and then choose **Consent to permissions**.

   :::image type="content" source="media/azure-entra-external-id-setup/graph-consent-1.png" alt-text="Screenshot of Graph consent for test user." lightbox="media/azure-entra-external-id-setup/graph-consent-1.png":::

1. Scroll to **User**. Consent to `User.ReadWrite.All`. This permission allows you to update the **Test Patient1** user with the `fhirUser` claim value.

   :::image type="content" source="media/azure-entra-external-id-setup/graph-consent-2.png" alt-text="Screenshot of Graph consent for fhirUser claim." lightbox="media/azure-entra-external-id-setup/graph-consent-2.png":::

1. After the consent process completes, update the user. You need the b2c-extensions-app application (client) ID and the user Object ID.

   - Change the method to `PATCH`.
   - Change the URL to [https://graph.microsoft.com/v1.0/users/{USER_OBJECT_ID}](#link-the-patient-resource-to-microsoft-entra-external-id-user).
   
   - Create the `PATCH` body. A `PATCH` body is a single key-value-pair, where the key format is `extension_<B2C-extensions-app-id>_fhirUser` and the value is the fully qualified FHIR resource ID for the patient `https://<your-fhir-service>.azurehealthcareapis.com/Patient/Patient1"`. Remove the hyphens from the b2c-extensions-app application (client) ID when you create the key.
       
   For example:

   ```json
   {
     "extension_00001111aaaa2222bbbb3333cccc4444_fhirUser": "https://myworkspace-myfhirservice.fhir.azurehealthcareapis.com/Patient/Patient1"
   }
   ```

   For more information, see [Manage extension attributes through Microsoft Graph](/entra/external-id/customers/how-to-define-custom-attributes#create-custom-user-attributes).

1. After the request is formatted, choose **Run query**. Wait for a successful response that confirms the user in the Microsoft Entra External ID tenant is linked to the patient resource in the FHIR service.

   :::image type="content" source="media/azure-entra-external-id-setup/graph-patch.png" alt-text="Screenshot of Graph patch." lightbox="media/azure-entra-external-id-setup/graph-patch.png":::

### Configuration to get an access token for Microsoft Entra External ID users

Get an access token to test the authentication flow.

>[!Note] 
>The `grant_type` of `authorization_code` is used to get an access token.
>Online tools are available that offer intuitive interfaces for API testing and development.

1. Launch the API testing application.

1. Select the **Authorization** tab in the tool.

1. In the **Type** dropdown list, select **OAuth 2.0**.

1. Enter the following values.

   - **Callback URL**. You configure this value when you create the Microsoft Entra External ID resource application.

   - **Auth URL**. Create this value by using the name of the Microsoft Entra External ID tenant and the Microsoft Entra External ID tenant ID. Replace your tenant name and tenant ID in the following URL.

      ```http
      https://<your-external-id-tenant-name>.ciamlogin.com/<your-external-id-tenant-id>/oauth2/v2.0/authorize
      ```

   - **Access Token URL**. Create this value by using the name of the Microsoft Entra External ID tenant and the Microsoft Entra External ID tenant ID. Replace your tenant name and tenant ID in the following URL.

      ```http
      https://<your-external-id-tenant-name>.ciamlogin.com/<your-external-id-tenant-id>/oauth2/v2.0/token
      ```

   - **Client ID**: This value is the application (client) ID of the  Microsoft Entra External resource application.

   - **Scope**. Define this value in the Microsoft Entra External ID resource application in the **Expose an API** section. The scope granted permission is `patient.all.read`. The scope request must be a fully qualified URL, for example, `https://testentraexternal.onmicrosoft.com/fhir/patient.all.read`. 

   - Copy the fully qualified scope from the **Expose an API** section of the Microsoft Entra External resource application.
   Example: *your-application-id-uri*/patient.all.read

### Fetch the patient resource by using the Microsoft Entra External ID user

Verify that Microsoft Entra External ID users can access FHIR resources.

1. When you set up the authorization configuration to launch the Microsoft Entra External ID user flow, select **Get New Access Token** to get an access token.

1. Use the **Test Patient** credentials to sign in.

1. Copy the access token and use it in fetching the Patient data.

To fetch the patient resource, follow the steps in the [Get the FHIR patient data](using-rest-client.md#get-fhir-patient-data) guide:

1. Select **Send Request**.

1. Verify that the response contains the single patient resource.

## Next steps

> [!div class="nextstepaction"]
> [Configure multiple identity providers](configure-identity-providers.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
