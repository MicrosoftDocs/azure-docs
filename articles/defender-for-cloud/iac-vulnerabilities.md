---
title: Discover misconfigurations in Infrastructure as Code
titleSuffix: Defender for Cloud
description: Learn how to use Defender for DevOps to discover misconfigurations in Infrastructure as Code (IaC)
ms.date: 09/20/2022
ms.topic: how-to
ms.custom: ignite-2022
---

# Discover misconfigurations in Infrastructure as Code (IaC)

Once you have set up the Microsoft Security DevOps GitHub action or Azure DevOps extension, extra support is located in the YAML configuration that can be used to run a specific tool, or several of the tools. For example, setting up the action or extension to run Infrastructure as Code (IaC) scanning only. This can help reduce pipeline run time.

## Prerequisites

- [Configure Microsoft Security DevOps GitHub action](github-action.md).
- [Configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).

## View the results of the IaC scan in GitHub 

1. Sign in to [GitHub](https://www.github.com). 

1. Navigate to **`your repository's home page`** > **.github/workflows** > **msdevopssec.yml** that was created in the [prerequisites](github-action.md#configure-the-microsoft-security-devops-github-action-1).    

1. Select **Edit file**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/workflow-yaml.png" alt-text="Screenshot that shows where to find the edit button for the msdevopssec.yml file." lightbox="media/tutorial-iac-vulnerabilities/workflow-yaml.png":::

1. Under the Run Analyzers section, add:

    ```yml
    with:
        categories: 'IaC'
    ```

    > [!NOTE] 
    > Categories are case sensitive.
    :::image type="content" source="media/tutorial-iac-vulnerabilities/add-to-yaml.png" alt-text="Screenshot that shows the information that needs to be added to the yaml file.":::

1. Select **Start Commit** 

1. Select **Commit changes**.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/commit-change.png" alt-text="Screenshot that shows where to select commit change on the githib page.":::

1. (Optional) Skip this step if you already have an IaC template in your repository.

    Follow this link to [Install an IaC template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/webapp-basic-linux).

    1. Select `azuredeploy.json`.
    
        :::image type="content" source="media/tutorial-iac-vulnerabilities/deploy-json.png" alt-text="Screenshot that shows where the deploy.json file is located.":::

    1. Select **Raw**
    
    1. Copy all the information in the file.

        ```Bash
        {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "webAppName": {
              "type": "string",
              "defaultValue": "AzureLinuxApp",
              "metadata": {
                "description": "Base name of the resource such as web app name and app service plan "
              },
              "minLength": 2
            },
            "sku": {
              "type": "string",
              "defaultValue": "S1",
              "metadata": {
                "description": "The SKU of App Service Plan "
              }
            },
            "linuxFxVersion": {
              "type": "string",
              "defaultValue": "php|7.4",
              "metadata": {
                "description": "The Runtime stack of current web app"
              }
            },
            "location": {
              "type": "string",
              "defaultValue": "[resourceGroup().location]",
              "metadata": {
                "description": "Location for all resources."
              }
            }
          },
          "variables": {
            "webAppPortalName": "[concat(parameters('webAppName'), '-webapp')]",
            "appServicePlanName": "[concat('AppServicePlan-', parameters('webAppName'))]"
          },
          "resources": [
            {
              "type": "Microsoft.Web/serverfarms",
              "apiVersion": "2020-06-01",
              "name": "[variables('appServicePlanName')]",
              "location": "[parameters('location')]",
              "sku": {
                "name": "[parameters('sku')]"
              },
              "kind": "linux",
              "properties": {
                "reserved": true
              }
            },
            {
              "type": "Microsoft.Web/sites",
              "apiVersion": "2020-06-01",
              "name": "[variables('webAppPortalName')]",
              "location": "[parameters('location')]",
              "kind": "app",
              "dependsOn": [
                "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]"
              ],
              "properties": {
                "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
                "siteConfig": {
                  "linuxFxVersion": "[parameters('linuxFxVersion')]"
                }
              }
            }
          ]
        }
        ```
    
    1. On GitHub, navigate to your repository.
    
    1. **Select Add file** > **Create new file**.
    
        :::image type="content" source="media/tutorial-iac-vulnerabilities/create-file.png" alt-text="Screenshot that shows you where to navigate to, to create a new file." lightbox="media/tutorial-iac-vulnerabilities/create-file.png":::

    1. Enter a name for the file.
    
    1. Paste the copied information into the file.
    
    1. Select **Commit new file**.
    
    The file is now added to your repository.

    :::image type="content" source="media/tutorial-iac-vulnerabilities/file-added.png" alt-text="Screenshot that shows that the new file you created has been added to your repository.":::

1. Select **Actions**. 

1. Select the workflow to see the results.

1. Navigate in the results to the scan results section.

1. Navigate to **Security** > **Code scanning alerts** to view the results of the scan.

## View the results of the IaC scan in Azure DevOps

**To view the results of the IaC scan in Azure DevOps**

1. Sign in to [Azure DevOps](https://dev.azure.com/)

1. Navigate to **Pipeline**.

1. Locate the pipeline with MSDO Azure DevOps Extension is configured.

1. Select **Edit**.

1. Add the following lines to the YAML file

    ```yml
    inputs:
        categories: 'IaC'
    ```

    :::image type="content" source="media/tutorial-iac-vulnerabilities/addition-to-yaml.png" alt-text="Screenshot showing you where to add this line to the YAML file.":::

1.  Select **Save**.

1.  Select **Save** to commit directly to the main branch or Create a new branch for this commit

1.  Select **Pipeline** > **`Your created pipeline`** to view the results of the IaC scan.

1. Select any result to see the details.

## Remediate PowerShell based rules:

Information about the PowerShell-based rules included by our integration with [PSRule for Azure](https://aka.ms/ps-rule-azure/rules). The tool will only evaluate the rules under the [Security pillar](https://azure.github.io/PSRule.Rules.Azure/en/rules/module/#security) unless the option `--include-non-security-rules` is used.

> [!NOTE]
> Severity levels are scaled from 1 to 3. Where 1 = High, 2 = Medium, 3 = Low.

### JSON-Based Rules:

#### TA-000001: Diagnostic logs in App Services should be enabled

Audits the enabling of diagnostic logs on the app. This enables you to recreate activity trails for investigation purposes if a security incident occurs or your network is compromised.

**Recommendation**: To [enable diagnostic logging](../app-service/troubleshoot-diagnostic-logs.md), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json), add (or update) the *detailedErrorLoggingEnabled*, *httpLoggingEnabled*, and *requestTracingEnabled* properties, setting their values to `true`.

**Severity level**: 2

#### TA-000002: Remote debugging should be turned off for API Apps

Remote debugging requires inbound ports to be opened on an API app. These ports become easy targets for compromise from various internet based attacks. If you no longer need to use remote debugging, it should be turned off.

**Recommendation**: To disable remote debugging, in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), remove the *remoteDebuggingEnabled* property or update its value to `false`.

**Severity level**: 3

#### TA-000003: FTPS only should be required in your API App

Enable FTPS enforcement for enhanced security.

**Recommendation**: To [enforce FTPS](../app-service/deploy-ftp.md?tabs=portal#enforce-ftps), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), add (or update) the *ftpsState* property, setting its value to `"FtpsOnly"` or `"Disabled"` if you don't need FTPS enabled.

**Severity level**: 1

#### TA-000004: API App Should Only Be Accessible Over HTTPS

API apps should require HTTPS to ensure connections are made to the expected server and data in transit is protected from network layer eavesdropping attacks.

**Recommendation**: To [use HTTPS to ensure, server/service authentication and protect data in transit from network layer eavesdropping attacks](../app-service/configure-ssl-bindings.md#enforce-https), in the [Microsoft.Web/Sites resource properties](/azure/templates/microsoft.web/sites?tabs=json#siteproperties-object), add (or update) the *httpsOnly* property, setting its value to `true`.

**Severity level**: 2

#### TA-000005: Latest TLS version should be used in your API App

API apps should require the latest TLS version.

**Recommendation**: To [enforce the latest TLS version](../app-service/configure-ssl-bindings.md#enforce-tls-versions), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), add (or update) the *minTlsVersion* property, setting its value to `1.2`.

**Severity level**: 1

#### TA-000006: CORS should not allow every resource to access your API App

Cross-Origin Resource Sharing (CORS) should not allow all domains to access your API app. Allow only required domains to interact with your API app.

**Recommendation**: To allow only required domains to interact with your API app, in the [Microsoft.Web/sites/config resource cors settings object](/azure/templates/microsoft.web/sites/config-web?tabs=json#corssettings-object), add (or update) the *allowedOrigins* property, setting its value to an array of allowed origins. Ensure it is *not* set to "*" (asterisks allows all origins).

**Severity level**: 3

#### TA-000007: Managed identity should be used in your API App

For enhanced authentication security, use a managed identity. On Azure, managed identities eliminate the need for developers to have to manage credentials by providing an identity for the Azure resource in Azure AD and using it to obtain Azure Active Directory (Azure AD) tokens.

**Recommendation**: To [use Managed Identity](../app-service/overview-managed-identity.md?tabs=dotnet), in the [Microsoft.Web/sites resource managed identity property](/azure/templates/microsoft.web/sites?tabs=json#ManagedServiceIdentity), add (or update) the *type* property, setting its value to `"SystemAssigned"` or `"UserAssigned"` and providing any necessary identifiers for the identity if required.

**Severity level**: 2

#### TA-000008: Remote debugging should be turned off for Function Apps

Remote debugging requires inbound ports to be opened on a function app. These ports become easy targets for compromise from various internet based attacks. If you no longer need to use remote debugging, it should be turned off.

**Recommendation**: To disable remote debugging, in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), remove the *remoteDebuggingEnabled* property or update its value to `false`.

**Severity level**: 3

#### TA-000009: FTPS only should be required in your Function App

Enable FTPS enforcement for enhanced security.

**Recommendation**: To [enforce FTPS](../app-service/deploy-ftp.md?tabs=portal#enforce-ftps), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), add (or update) the *ftpsState* property, setting its value to `"FtpsOnly"` or `"Disabled"` if you don't need FTPS enabled.

**Severity level**: 1

#### TA-000010: Function App Should Only Be Accessible Over HTTPS

Function apps should require HTTPS to ensure connections are made to the expected server and data in transit is protected from network layer eavesdropping attacks.

**Recommendation**: To [use HTTPS to ensure, server/service authentication and protect data in transit from network layer eavesdropping attacks](../app-service/configure-ssl-bindings.md#enforce-https), in the [Microsoft.Web/Sites resource properties](/azure/templates/microsoft.web/sites?tabs=json#siteproperties-object), add (or update) the *httpsOnly* property, setting its value to `true`.

**Severity level**: 2

#### TA-000011: Latest TLS version should be used in your Function App

Function apps should require the latest TLS version.

**Recommendation**: To [enforce the latest TLS version](../app-service/configure-ssl-bindings.md#enforce-tls-versions), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), add (or update) the *minTlsVersion* property, setting its value to `1.2`.

**Severity level**: 1

#### TA-000012: CORS should not allow every resource to access your Function Apps

Cross-Origin Resource Sharing (CORS) should not allow all domains to access your function app. Allow only required domains to interact with your function app.

**Recommendation**: To allow only required domains to interact with your function app, in the [Microsoft.Web/sites/config resource cors settings object](/azure/templates/microsoft.web/sites/config-web?tabs=json#corssettings-object), add (or update) the *allowedOrigins* property, setting its value to an array of allowed origins. Ensure it is *not* set to "*" (asterisks allows all origins).

**Severity level**: 3

#### TA-000013: Managed identity should be used in your Function App

For enhanced authentication security, use a managed identity. On Azure, managed identities eliminate the need for developers to have to manage credentials by providing an identity for the Azure resource in Azure AD and using it to obtain Azure Active Directory (Azure AD) tokens.

**Recommendation**: To [use Managed Identity](../app-service/overview-managed-identity.md?tabs=dotnet), in the [Microsoft.Web/sites resource managed identity property](/azure/templates/microsoft.web/sites?tabs=json#ManagedServiceIdentity), add (or update) the *type* property, setting its value to `"SystemAssigned"` or `"UserAssigned"` and providing any necessary identifiers for the identity if required.

**Severity level**: 2

#### TA-000014: Remote debugging should be turned off for Web Applications

Remote debugging requires inbound ports to be opened on a web application. These ports become easy targets for compromise from various internet based attacks. If you no longer need to use remote debugging, it should be turned off.

**Recommendation**: To disable remote debugging, in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), remove the *remoteDebuggingEnabled* property or update its value to `false`.

**Severity level**: 3

#### TA-000015: FTPS only should be required in your Web App

Enable FTPS enforcement for enhanced security.

**Recommendation**: To [enforce FTPS](../app-service/deploy-ftp.md?tabs=portal#enforce-ftps), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), add (or update) the *ftpsState* property, setting its value to `"FtpsOnly"` or `"Disabled"` if you don't need FTPS enabled.

**Severity level**: 1

#### TA-000016: Web Application Should Only Be Accessible Over HTTPS

Web apps should require HTTPS to ensure connections are made to the expected server and data in transit is protected from network layer eavesdropping attacks.

**Recommendation**: To [use HTTPS to ensure server/service authentication and protect data in transit from network layer eavesdropping attacks](../app-service/configure-ssl-bindings.md#enforce-https), in the [Microsoft.Web/Sites resource properties](/azure/templates/microsoft.web/sites?tabs=json#siteproperties-object), add (or update) the *httpsOnly* property, setting its value to `true`.

**Severity level**: 2

#### TA-000017: Latest TLS version should be used in your Web App

Web apps should require the latest TLS version.

**Recommendation**: 
To [enforce the latest TLS version](../app-service/configure-ssl-bindings.md#enforce-tls-versions), in the [Microsoft.Web/sites/config resource properties](/azure/templates/microsoft.web/sites/config-web?tabs=json#SiteConfig), add (or update) the *minTlsVersion* property, setting its value to `1.2`.

**Severity level**: 1

#### TA-000018: CORS should not allow every resource to access your Web Applications

Cross-Origin Resource Sharing (CORS) should not allow all domains to access your Web application. Allow only required domains to interact with your web app.

**Recommendation**: To allow only required domains to interact with your web app, in the [Microsoft.Web/sites/config resource cors settings object](/azure/templates/microsoft.web/sites/config-web?tabs=json#corssettings-object), add (or update) the *allowedOrigins* property, setting its value to an array of allowed origins. Ensure it is *not* set to "*" (asterisks allows all origins).

**Severity level**: 3

#### TA-000019: Managed identity should be used in your Web App

For enhanced authentication security, use a managed identity. On Azure, managed identities eliminate the need for developers to have to manage credentials by providing an identity for the Azure resource in Azure AD and using it to obtain Azure Active Directory (Azure AD) tokens.

**Recommendation**: To [use Managed Identity](../app-service/overview-managed-identity.md?tabs=dotnet), in the [Microsoft.Web/sites resource managed identity property](/azure/templates/microsoft.web/sites?tabs=json#ManagedServiceIdentity), add (or update) the *type* property, setting its value to `"SystemAssigned"` or `"UserAssigned"` and providing any necessary identifiers for the identity if required.

**Severity level**: 2

#### TA-000020: Audit usage of custom RBAC roles

Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling.

**Recommendation**: [Use built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles](../role-based-access-control/built-in-roles.md)

**Severity level**: 3

#### TA-000021: Automation account variables should be encrypted

It is important to enable encryption of Automation account variable assets when storing sensitive data. This step can only be taken at creation time. If you have Automation Account Variables storing sensitive data that are not already encrypted, then you will need to delete them and recreate them as encrypted variables. To apply encryption of the Automation account variable assets, in Azure PowerShell - run [the following command](/powershell/module/az.automation/set-azautomationvariable?view=azps-5.4.0&viewFallbackFrom=azps-1.4.0): `Set-AzAutomationVariable -AutomationAccountName '{AutomationAccountName}' -Encrypted $true -Name '{VariableName}' -ResourceGroupName '{ResourceGroupName}' -Value '{Value}'`

**Recommendation**: [Enable encryption of Automation account variable assets](../automation/shared-resources/variables.md?tabs=azure-powershell)

**Severity level**: 1

#### TA-000022: Only secure connections to your Azure Cache for Redis should be enabled

Enable only connections via SSL to Redis Cache. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.

**Recommendation**: To [enable only connections via SSL to Redis Cache](/security/benchmark/azure/baselines/azure-cache-for-redis-security-baseline?toc=/azure/azure-cache-for-redis/TOC.json#44-encrypt-all-sensitive-information-in-transit), in the [Microsoft.Cache/Redis resource properties](/azure/templates/microsoft.cache/redis?tabs=json#rediscreateproperties-object), update the value of the *enableNonSslPort* property from `true` to `false` or remove the property from the template as the default value is `false`.

**Severity level**: 1

#### TA-000023: Authorized IP ranges should be defined on Kubernetes Services

To ensure that only applications from allowed networks, machines, or subnets can access your cluster, restrict access to your Kubernetes Service Management API server. It is recommended to limit access to authorized IP ranges to ensure that only applications from allowed networks can access the cluster.

**Recommendation**: [Restrict access by defining authorized IP ranges](../aks/api-server-authorized-ip-ranges.md) or [set up your API servers as private clusters](../aks/private-clusters.md)

**Severity level**: 1

#### TA-000024: Role-Based Access Control (RBAC) should be used on Kubernetes Services

To provide granular filtering on the actions that users can perform, use Role-Based Access Control (RBAC) to manage permissions in Kubernetes Service Clusters and configure relevant authorization policies. To Use Role-Based Access Control (RBAC) you must recreate your Kubernetes Service cluster and enable RBAC during the creation process.

**Recommendation**: [Enable RBAC in Kubernetes clusters](../aks/operator-best-practices-identity.md#use-azure-rbac)

**Severity level**: 1

#### TA-000025: Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version

Upgrade your Kubernetes service cluster to a later Kubernetes version to protect against known vulnerabilities in your current Kubernetes version. [Vulnerability CVE-2019-9946](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-9946) has been patched in Kubernetes versions 1.11.9+, 1.12.7+, 1.13.5+, and 1.14.0+. Running on older versions could mean you are not using latest security classes. Usage of such old classes and types can make your application vulnerable.

**Recommendation**: To [upgrade Kubernetes service clusters](../aks/upgrade-cluster.md), in the [Microsoft.ContainerService/managedClusters resource properties](/azure/templates/microsoft.containerservice/managedclusters?tabs=json#managedclusterproperties-object), update the *kubernetesVersion* property, setting its value to one of the following versions (making sure to specify the minor version number): 1.11.9+, 1.12.7+, 1.13.5+, or 1.14.0+.

**Severity level**: 1

#### TA-000026: Service Fabric clusters should only use Azure Active Directory for client authentication

Service Fabric clusters should only use Azure Active Directory for client authentication. A Service Fabric cluster offers several entry points to its management functionality, including the web-based Service Fabric Explorer, Visual Studio and PowerShell. Access to the cluster must be controlled using AAD.

**Recommendation**: [Enable AAD client authentication on your Service Fabric clusters](../service-fabric/service-fabric-cluster-creation-setup-aad.md)

**Severity level**: 1

#### TA-000027: Transparent Data Encryption on SQL databases should be enabled

Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements.

**Recommendation**: To [enable transparent data encryption](/azure/azure-sql/database/transparent-data-encryption-tde-overview?tabs=azure-portal), in the [Microsoft.Sql/servers/databases/transparentDataEncryption resource properties](/azure/templates/microsoft.sql/servers/databases/transparentdataencryption?tabs=json), add (or update) the value of the *state* property to `enabled`.

**Severity level**: 3

#### TA-000028: SQL servers with auditing to storage account destination should be configured with 90 days retention or higher

Set the data retention for your SQL Server's auditing to storage account destination to at least 90 days.

**Recommendation**: For incident investigation purposes, we recommend setting the data retention for your SQL Server's auditing to storage account destination to at least 90 days, in the [Microsoft.Sql/servers/auditingSettings resource properties](/azure/templates/microsoft.sql/2020-11-01-preview/servers/auditingsettings?tabs=json#serverblobauditingpolicyproperties-object), using the *retentionDays* property. Confirm that you are meeting the necessary retention rules for the regions in which you are operating. This is sometimes required for compliance with regulatory standards.

**Severity level**: 3

#### TA-000029: Azure API Management APIs should use encrypted protocols only

Set the protocols property to only include HTTPs.

**Recommendation**: To use encrypted protocols only, add (or update) the *protocols* property in the [Microsoft.ApiManagement/service/apis resource properties](/azure/templates/microsoft.apimanagement/service/apis?tabs=json), to only include HTTPS. Allowing any additional protocols (for example, HTTP, WS) is insecure.

**Severity level**: 1

## Learn more

- Learn more about the [Template Best Practice Analyzer](https://github.com/Azure/template-analyzer).

In this tutorial you learned how to configure the Microsoft Security DevOps GitHub Action and Azure DevOps Extension to scan for only Infrastructure as Code misconfigurations.

## Next steps

Learn more about [Defender for DevOps](defender-for-devops-introduction.md).

Learn how to [connect your GitHub](quickstart-onboard-github.md) to Defender for Cloud.

Learn how to [connect your Azure DevOps](quickstart-onboard-devops.md) to Defender for Cloud.