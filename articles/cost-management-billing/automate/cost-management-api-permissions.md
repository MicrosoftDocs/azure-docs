# Assign Permissions to ACM APIs – Overview

Before using the Azure Cost Management APIs you need to properly assign permissions to a Service Principal. From there you can use the Service Principal identity to call the APIs.

## **Permissions configuration checklist**

- Familiarize yourself with the [Azure Resource Manager REST APIs](https://docs.microsoft.com/en-us/rest/api/azure).
- Determine which Azure Cost Management APIs you wish to use. To learn more about what APIs are available to you, see Azure Cost Management Automation Overview. \&lt;Link needed\&gt;
- Configure service authorization and authentication for the Azure Resource Manager APIs.

  - If you&#39;re not already using Azure Resource Manager APIs, [register your client app with Azure AD](https://docs.microsoft.com/en-us/rest/api/azure/#register-your-client-application-with-azure-ad). Registration creates a service principal for you to use to call the APIs.
  - Assign the service principal access to the scopes needed, as outlined below.
  - Update any programming code to use [Azure AD authentication](https://docs.microsoft.com/en-us/rest/api/azure/#create-the-request) with your Service Principal.


## **Assign Service Principal access to Azure Resource Manager APIs**

After you create a Service Principal to programmatically call the Azure Resource Manager APIs, you need to assign it the proper permissions to authorize against and execute requests in Azure Resource Manager. There are two permission frameworks for different scenarios.

### **Azure Billing Hierarchy Access**

If you have an Azure Enterprise Agreement or a Microsoft Customer Agreement you can configure Service Principal access to Cost Management data in your billing account. To learn more about the Billing Hierarchies available and what permissions are needed to call each API in Azure Cost Management see [Understand and work with scopes](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-work-scopes).

- _Enterprise Agreements:_ To assign Service Principal permissions to your Enterprise Billing Account, Departments, or Enrollment Account scopes, see [Assign roles to Azure Enterprise Agreement service principal names](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/assign-roles-azure-service-principals).

- _Microsoft Customer Agreements:_ To assign Service Principal permissions to your Microsoft Customer Agreement Billing Account, Billing Profile, Invoice Section or Customer scopes, see [Manage billing roles in the Azure Portal](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/understand-mca-roles#manage-billing-roles-in-the-azure-portal). Configure the permission to your Service Principal in the Portal as you would a normal user. If you are looking to automate permissions assignment, see our [Billing Role Assignments API](https://docs.microsoft.com/en-us/rest/api/billing/2020-05-01/billing-role-assignments).

### **Azure role-based access control**

New Service Principal support extends to Azure-specific scopes, like management groups, subscriptions, and resource groups. You can assign Service Principal permissions to these scopes directly [in the Azure portal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) or by using [Azure PowerShell](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-authenticate-service-principal-powershell#assign-the-application-to-a-role).