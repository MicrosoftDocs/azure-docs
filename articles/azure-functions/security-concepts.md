---
title: Securing Azure Functions
description: Learn how to secure your Azure Functions code against common attacks by using best practices and built-in security features.
ms.date: 01/20/2026
ms.topic: concept-article

#Customer intent: As a developer, I want to understand the security features and principles of Azure Functions so that I can make my cloud-based function code as secure as possible.
---

# Securing Azure Functions

[Azure App Service](../app-service/index.yml) provides the hosting infrastructure for your function apps. This article provides security strategies for running your function code, and how App Service can help you secure your functions.

[!INCLUDE [app-service-security-intro](../../includes/app-service-security-intro.md)]

For a set of security recommendations that follow the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction), see [Azure Security Baseline for Azure Functions](/security/benchmark/azure/baselines/functions-security-baseline).

While planning for secure development, deployment, and operation of serverless functions is much the same as for any web-based or cloud-hosted application, serverless applications are likely vulnerable to variations of traditional attacks. To learn more about potential attacks on serverless infrastructure, see the [OWASP Top 10: Serverless Interpretation](https://owasp.org/www-project-serverless-top-10/).

## Secure operation

This section guides you on configuring and running your function app as securely as possible.

### Defender for Cloud

Defender for Cloud integrates with your function app in the portal. It provides a quick assessment of potential configuration-related security vulnerabilities. Function apps running in a dedicated plan can also use Defender for Cloud's enhanced security features for an extra cost. For more information, see [Defender for App Service](/azure/defender-for-cloud/defender-for-app-service-introduction).

### Log and monitor

One way to detect attacks is through activity monitoring and logging analytics. Functions integrates with Application Insights to collect log, performance, and error data for your function app. Application Insights automatically detects performance anomalies and includes powerful analytics tools to help you diagnose issues and understand how your functions are used. For more information, see [Monitor Azure Functions](functions-monitoring.md).

Functions also integrates with Azure Monitor Logs to enable you to consolidate function app logs with system events for easier analysis. You can use diagnostic settings to configure the streaming export of platform logs and metrics for your functions to the destination of your choice, such as a Logs Analytics workspace. For more information, see [Monitoring Azure Functions with Azure Monitor Logs](functions-monitor-log-analytics.md).

For enterprise-level threat detection and response automation, stream your logs and events to a Logs Analytics workspace. You can then connect Microsoft Sentinel to this workspace. For more information, see [What is Microsoft Sentinel](../sentinel/overview.md).  

For more security recommendations for observability, see the [Azure security baseline for Azure Functions](security-baseline.md#logging-and-monitoring).

### Secure HTTP endpoints

HTTP endpoints that you expose publicly provide a vector of attack for malicious actors. When securing your HTTP endpoints, use a layered security approach. Use these techniques to reduce the vulnerability of publicly exposed HTTP endpoints, ordered from most basic to most secure and restrictive:

+ [Require HTTPS](#require-https)
+ [Require access keys](#function-access-keys)
+ [Enable App Service Authentication/Authorization](#enable-app-service-authenticationauthorization)
+ [Use Azure API Management (APIM) to authenticate requests](#use-azure-api-management-apim-to-authenticate-requests)
+ [Deploy your function app to a virtual network](#deploy-your-function-app-to-a-virtual-network)
+ [Deploy your function app in isolation](#deploy-your-function-app-in-isolation)

### Require HTTPS

By default, clients can connect to function endpoints by using either HTTP or HTTPS. Redirect HTTP to HTTPS because HTTPS uses the TLS protocol to provide a secure connection, which is both encrypted and authenticated. To learn how, see [Enforce HTTPS](../app-service/configure-ssl-bindings.md#enforce-https).

When you require HTTPS, also require the latest TLS version. To learn how, see [Enforce TLS versions](../app-service/configure-ssl-bindings.md#enforce-tls-versions).

For more information, see [Secure connections (TLS)](../app-service/overview-security.md#https-and-certificates).

### Function access keys

Functions uses keys to make it harder to access your function endpoints. Unless you set the HTTP access level on an HTTP triggered function to `anonymous`, requests must include an access key in the request. For more information, see [Work with access keys in Azure Functions](function-keys-how-to.md).

While access keys can help prevent unwanted access, the only way to truly secure your function endpoints is by implementing positive authentication of clients accessing your functions. You can then make authorization decisions based on identity.

For the highest level of security, secure the entire application architecture inside a virtual network [using private endpoints](#deploy-your-function-app-to-a-virtual-network) or by [running in isolation](#deploy-your-function-app-in-isolation).

### Disable administrative endpoints

Function apps can serve administrative endpoints under the `/admin` route. You can use these endpoints for operations such as obtaining host status information and performing test invocations. When exposed, requests against these endpoints must include the app's master key. You can also access administrative operations through the [Azure Resource Manager `Microsoft.Web/sites` API](/rest/api/appservice/web-apps), which offers Azure RBAC. To disable the `/admin` endpoints, set the `functionsRuntimeAdminIsolationEnabled` site property in your app to `true`. For more information, see the [functionsRuntimeAdminIsolationEnabled](functions-app-settings.md#functionsruntimeadminisolationenabled) property reference.

### Enable App Service Authentication/Authorization

The App Service platform lets you use Microsoft Entra ID and several non-Microsoft identity providers to authenticate clients. Use this strategy to implement custom authorization rules for your functions. You can work with user information from your function code. For more information, see [Authentication and authorization in Azure App Service](../app-service/overview-authentication-authorization.md) and [Working with client identities](functions-bindings-http-webhook-trigger.md#working-with-client-identities).

### Use Azure API Management (APIM) to authenticate requests

APIM provides various API security options for incoming requests. For more information, see [API Management authentication policies](../api-management/api-management-policies.md#authentication-and-authorization). By using APIM, you can configure your function app to accept requests only from the IP address of your APIM instance. For more information, see [IP address restrictions](ip-addresses.md#ip-address-restrictions).

### Permissions

As with any application or service, run your function app with the lowest possible permissions.

#### User management permissions

Functions supports built-in [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). Azure roles supported by Functions are [Contributor](../role-based-access-control/built-in-roles.md#contributor), [Owner](../role-based-access-control/built-in-roles.md#owner), and [Reader](../role-based-access-control/built-in-roles.md#reader).

Permissions take effect at the function app level. The Contributor role is required to perform most function app-level tasks. You also need the Contributor role along with the [Monitoring Reader permission](/azure/azure-monitor/roles-permissions-security#monitoring-reader) to view log data in Application Insights. Only the Owner role can delete a function app.  

#### Organize functions by privilege

Connection strings and other credentials stored in application settings give all of the functions in the function app the same set of permissions in the associated resource. Consider minimizing the number of functions with access to specific credentials by moving functions that don't use those credentials to a separate function app. You can always use techniques such as [function chaining](/training/modules/chain-azure-functions-data-using-bindings/) to pass data between functions in different function apps.  

#### Managed identities

[!INCLUDE [app-service-managed-identities](../../includes/app-service-managed-identities.md)]

Use managed identities instead of secrets for connections from some triggers and bindings. See [Identity-based connections](#identity-based-connections).

For more information, see [Use managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md?toc=/azure/azure-functions/toc.json).

#### Restrict CORS access

[Cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) is a way to allow web apps running in another domain to make requests to your HTTP trigger endpoints. App Service provides built-in support for handling the required CORS headers in HTTP requests. CORS rules are defined on a function app level.  

It's tempting to use a wildcard that allows all sites to access your endpoint. This approach defeats the purpose of CORS, which is to help prevent cross-site scripting attacks. Instead, add a separate CORS entry for the domain of each web app that must access your endpoint.

### Managing secrets

To connect to the various services and resources needed to run your code, function apps need access to secrets, such as connection strings and service keys. This section describes how to store secrets required by your functions.

Never store secrets in your function code.

#### Application settings

By default, store connection strings and secrets used by your function app and bindings as application settings. This approach makes these credentials available to both your function code and the various bindings used by the function. Use the application setting (key) name to retrieve the actual value, which is the secret.

For example, every function app requires an associated storage account, which the runtime uses. By default, you store the connection to this storage account in an application setting named `AzureWebJobsStorage`.

Azure encrypts app settings and connection strings. The app settings and connection strings are decrypted only before being injected into your app's process memory when the app starts. The encryption keys are rotated regularly. If you prefer to manage the secure storage of your secrets, make the app settings references to Azure Key Vault secrets.

When developing functions on your local computer, you can also encrypt settings by default in the `local.settings.json` file. For more information, see [Encrypt the local settings file](functions-run-local.md#encrypt-the-local-settings-file).  

#### Key Vault references

While application settings are sufficient for most functions, you might want to share the same secrets across multiple services. In this case, redundant storage of secrets results in more potential vulnerabilities. A more secure approach is to use a central secret storage service and use references to this service instead of the secrets themselves.

[Azure Key Vault](/azure/key-vault/general/overview) is a service that provides centralized secrets management, with full control over access policies and audit history. You can use a Key Vault reference in the place of a connection string or key in your application settings. For more information, see [Use Key Vault references for App Service and Azure Functions](../app-service/app-service-key-vault-references.md?toc=/azure/azure-functions/toc.json).

### Identity-based connections

Use identities in place of secrets for connecting to some resources. This approach has the advantage of not requiring the management of a secret, and it provides more fine-grained access control and auditing.

When you write code that creates the connection to [Azure services that support Microsoft Entra authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#services-supporting-managed-identities), you can use an identity instead of a secret or connection string. Details for both connection methods are covered in the documentation for each service.

You can configure some Azure Functions binding extensions to access services by using identity-based connections. For more information, see [Configure an identity-based connection](./functions-reference.md#configure-an-identity-based-connection).

### Set usage quotas

Consider setting a usage quota for functions running in a Consumption plan. When you set a daily GB-sec limit on the total execution of functions in your function app, execution stops when the limit is reached. This approach could potentially help protect against malicious code executing your functions. To learn how to estimate consumption for your functions, see [Estimating Consumption plan costs](functions-consumption-costs.md).

### Data validation

The triggers and bindings used by your functions don't provide any extra data validation. Your code must validate any data received from a trigger or input binding. If an upstream service is compromised, you don't want unvalidated inputs flowing through your functions. For example, if your function stores data from an Azure Storage queue in a relational database, you must validate the data and parameterize your commands to avoid SQL injection attacks.

Don't assume that the data coming into your function is already validated or sanitized. It's also a good idea to verify that the data being written to output bindings is valid.

### Handle errors

While it seems basic, it's important to write good error handling in your functions. Unhandled errors bubble up to the host, and the runtime handles these errors. Different bindings handle the processing of errors differently. For more information, see [Azure Functions error handling](functions-bindings-error-pages.md).

### Disable remote debugging

Make sure that remote debugging is disabled, except when you're actively debugging your functions. You can disable remote debugging in the **General Settings** tab of your function app **Configuration** in the portal.

### Restrict CORS access

[!INCLUDE [functions-cors](../../includes/functions-cors.md)]

Don't use wildcards in your allowed origins list. Instead, list the specific domains from which you expect to get requests.

### Store data encrypted

[!INCLUDE [functions-storage-encryption](../../includes/functions-storage-encryption.md)]

### Secure related resources

A function app frequently depends on other resources, so part of securing the app is securing these external resources. At a minimum, most function apps include a dependency on Application Insights and Azure Storage. For guidance on securing these resources, consult the [Azure security baseline for Azure Monitor](/security/benchmark/azure/baselines/azure-monitor-security-baseline) and the [Azure security baseline for Storage](/security/benchmark/azure/baselines/storage-security-baseline).

[!INCLUDE [functions-storage-access-note](../../includes/functions-storage-access-note.md)]

You should also consult the guidance for any resource types your application logic depends on, both as triggers and bindings and from your function code.

## Secure deployment

Azure Functions tooling integration makes it easy to publish local function project code to Azure. It's important to understand how deployment works when considering security for an Azure Functions topology.

### Deployment credentials

App Service deployments require a set of deployment credentials. You use these deployment credentials to secure your function app deployments. The App Service platform manages deployment credentials and encrypts them at rest.

There are two kinds of deployment credentials:

[!INCLUDE [app-service-deploy-credentials](../../includes/app-service-deploy-credentials.md)]

At this time, Key Vault isn't supported for deployment credentials. To learn more about managing deployment credentials, see [Configure deployment credentials for Azure App Service](../app-service/deploy-configure-credentials.md).

### Disable FTP

By default, each function app has an FTP endpoint enabled. The FTP endpoint is accessed using deployment credentials.

FTP isn't recommended for deploying your function code. FTP deployments are manual, and they require you to synchronize triggers. For more information, see [FTP deployment](functions-deployment-technologies.md#ftps).

When you're not using FTP, keep it disabled. You can change this setting in the portal. If you do choose to use FTP, [enforce FTPS](../app-service/deploy-ftp.md#enforce-ftps).

### Secure the `scm` endpoint

Each function app has a corresponding `scm` service endpoint that the Advanced Tools (Kudu) service uses for deployments and other App Service [site extensions](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions). The `scm` endpoint for a function app is always a URL in the form `https://<FUNCTION_APP_NAME>.scm.azurewebsites.net`. When you use network isolation to secure your functions, you must also account for this endpoint.

By using a separate `scm` endpoint, you can control deployments and other Advanced Tools functionalities for function apps that are isolated or running in a virtual network. The `scm` endpoint supports both basic authentication (by using deployment credentials) and single sign-on with your Azure portal credentials. For more information, see [Accessing the Kudu service](https://github.com/projectkudu/kudu/wiki/Accessing-the-kudu-service).

### Continuous security validation

Because you need to consider security at every step in the development process, it makes sense to also implement security validations in a continuous deployment environment. This approach is sometimes called *DevSecOps*. By using Azure DevOps for your deployment pipeline, you can integrate validation into the deployment process. For more information, see [Secure your Azure Pipelines](/azure/devops/pipelines/security/overview).  

## Network security

By restricting network access to your function app, you can control who can access your functions endpoints. Functions uses App Service infrastructure to enable your functions to access resources without using internet-routable addresses or to restrict internet access to a function endpoint. To learn more about these networking options, see [Azure Functions networking options](functions-networking-options.md).

### Set access restrictions

Access restrictions allow you to define lists of allow and deny rules to control traffic to your app. Rules are evaluated in priority order. If you don't define any rules, your app accepts traffic from any address. For more information, see [Azure App Service access restrictions](../app-service/app-service-ip-restrictions.md?toc=/azure/azure-functions/toc.json).

### Secure the storage account

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. You can replace this storage account with one that is secured by a virtual network with access enabled by service endpoints or private endpoints. For more information, see [Restrict your storage account to a virtual network](./functions-networking-options.md#restrict-your-storage-account-to-a-virtual-network).

### Deploy your function app to a virtual network

[!INCLUDE [functions-private-site-access](../../includes/functions-private-site-access.md)]

### Deploy your function app in isolation

Azure App Service Environment provides a dedicated hosting environment in which to run your functions. These environments let you configure a single front-end gateway that you can use to authenticate all incoming requests. For more information, see [Integrate your ILB App Service Environment with the Azure Application Gateway](../app-service/environment/integrate-with-application-gateway.md).

### Use a gateway service

By using gateway services such as [Azure Application Gateway](../application-gateway/overview.md) and [Azure Front Door](../frontdoor/front-door-overview.md), you can set up a Web Application Firewall (WAF). WAF rules monitor or block detected attacks, which provides an extra layer of protection for your functions. To set up a WAF, your function app needs to run in an ASE or use Private Endpoints (preview). For more information, see [Using private endpoints](../app-service/networking/private-endpoint.md).

## Next steps

+ [Azure security baseline for Azure Functions](security-baseline.md)
+ [Azure Functions diagnostics](functions-diagnostics.md)
