## Authentication and Authorization 

The single most important part of your application is its security. No matter how good the user experience might be, if your application isn't secure a hacker can ruin it.

The following are some tips to keep your Azure Maps application secure. When using Azure, be sure to familiarize yourself with the security tools available to you. For more information, See the [introduction to Azure security](/azure/security/fundamentals/overview).

### Understanding security threats

If a hacker gains access to your Azure Maps account, they can potentially use it to make thousands of search requests which could result in decreased performance and billable transactions to your account.

When considering best practices for securing your Azure Maps applications, you will need to consider the different Azure Maps account SKUs available and their cost structures to limit your financial exposure. You will also need to understand the different authentication options available.

### Azure Maps account SKUs

When creating an Azure Maps account, you must select a SKU. There are currently three different SKUs that you can select, and each has different capabilities as well as cost structures that impact your potential liability if hackers gain access to your account and performs billable transactions.

For example, if you have an a S1 or G2 SKU account, and a malicious actor obtains a [shared key](azure-maps-authentication.md#shared-key-authentication.md) from an HTTP request, they may be able to submit a [Batch Search request](/rest/api/maps/search/get-search-address-batch#submit-asynchronous-batch-request) for 10,000 transactions and the account will be charged. This is not possible if your Azure Maps account SKU is S0 since batch search requests are not available. Another way that the S0 SKU can lower your risk is by supporting a lower number of [queries per second](azure-maps-qps-rate-limits) (QPS), so the S0 SKU might be a good choice for someone new to Azure Maps, or for small-scale deployments that do not require the added capabilities offered by the S1 or Gen 2 SKUs.

For more information about the costs associated with each SKU and what capabilities they support, see [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/).

## Authentication best practices in Azure Maps

When creating a publicly facing client application with Azure Maps using any of the available SDKs whether it be Android, iOS or the Web SDK, you must ensure that your authentication to Azure Maps is not stolen and used by malicious actors.

### Publicly facing client applications that works with Azure Maps

If using Shared Key (Subscription key-based authentication), keep in mind that the key grants access to all Azure Maps REST API that are available in the SKU selected when creating the Azure Maps account and the key can be easily obtained from an HTTP request. If you do use subscription keys, be sure to [rotate them regularly](how-to-manage-authentication.md#manage-and-rotate-shared-keys) and keep in mind that Shared Key does not allow for configurable lifetime, it must be done manually. You should also consider using [Shared Key authentication with Azure Key Vault](how-to-secure-daemon-app.md#scenario-shared-key-authentication-with-azure-key-vault) which enables you to configure the lifetime of your shared key.

If using [Azure Active Directory (Azure AD) authentication](./azure/active-directory/fundamentals/active-directory-whatis) or [Shared Access Signature (SAS) Token authentication](azure-maps-authentication.md#shared-access-signature-token-authentication) (preview), access to Azure Maps REST APIs is authorized using [role-based access control (RBAC)](azure-maps-authentication.md#authorization-with-role-based-access-control). RBAC enables you to control what access is given to the issued tokens. You should consider how long access should be granted for the tokens. Unlike Shared Key authentication, the lifetime of these tokens is configurable.

you should consider defining which domains have access to your Azure Map account using [Cross origin resource sharing (CORS)](azure-maps-authentication.md#cross-origin-resource-sharing-cors).
CORS instructs the clients browser on which origin such as "https://microsoft.com" is allowed to request resources for the Azure Map account.

### When building a web server or service that works with Azure Maps

If you're developing a web server or service, CORS is not applicable.

If using Shared Key (Subscription key-based authentication), keep in mind that the key grants access to all Azure Maps REST API that are available in the SKU selected when creating the Azure Maps account and the key can be easily obtained from an HTTP request. If you do use subscription keys, be sure to [rotate them regularly](how-to-manage-authentication.md#manage-and-rotate-shared-keys) and keep in mind that Shared Key does not allow for configurable lifetime, it must be done manually. You should also consider using
[Shared Key authentication with Azure Key Vault](how-to-secure-daemon-app.md#scenario-shared-key-authentication-with-azure-key-vault) which enables you to configure the lifetime of your shared key.

If using [Azure Active Directory (Azure AD) authentication](/azure/active-directory/fundamentals/active-directory-whatis) or [Shared Access Signature (SAS) Token authentication](azure-maps-authentication.md#shared-access-signature-token-authentication) (preview), access to Azure Maps REST APIs is authorized using [role-based access control
(RBAC)](azure-maps-authentication.md#authorization-with-role-based-access-control). RBAC enables you to control what access is given to the issued tokens. You should consider how long access should be granted for the tokens. Unlike Shared Key authentication, the lifetime of these tokens is configurable.

You may prefer to avoid using secrets when using Azure resources that support [Managed Identities](/azure/active-directory/managed-identities-azure-resources/overview). Managed identities can provide an identity for your web service to use when connecting to Azure Maps using Azure Active Directory (Azure AD) authentication. In this case your web service will use the managed identity to obtain the required Azure AD tokens. You should use Azure RBAC to configure what access the web service is given, using the [Least privileged roles](/azure/active-directory/roles/delegate-by-task) possible.
