---
title: Troubleshoot cluster configuration
description: How to understand and fix errors for Trino clusters for HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---


# Troubleshoot cluster configuration

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Incorrect cluster configuration may lead to deployment errors. Typically those errors occur when incorrect configuration provided in ARM template or input in Azure portal, for example, on Configuration management page. 

> [!NOTE]
> Those errors will have reason starting with "User." prefix.

Example configuration error:

:::image type="content" source="./media/trino-configuration-troubleshoot/error-user-configuration-trino.png" alt-text="Screenshot of user configuration error.":::

The following table provides error codes and their description to help diagnose and fix common errors.

## Configuration errors
|Error code|Description
|----|----|
|User.TrinoError|Trino process startup fails with generic error. Verify trino specific configuration files in [Service configuration profile](./trino-service-configuration.md).
|User.Configuration.TrinoError|Trino process startup fails with application configuration error. Verify trino specific configuration files in [Service configuration profile](./trino-service-configuration.md).
|User.Configuration.FileForbidden|Changes to some trino configuration files aren't allowed.
|User.Configuration.ParameterForbidden|Changes to some trino configuration parameters aren't allowed.
|User.Configuration.InvalidComponent|Invalid service component specified. For more information, see [Service configuration profile](./trino-service-configuration.md).
|User.Configuration.MiscFile.InvalidName|Invalid miscellaneous fileName. For more information, see [Miscellaneous files](./trino-miscellaneous-files.md).
|User.Configuration.MiscFile.InvalidPath|Miscellaneous file path is too long.
|User.Configuration.MiscFile.NotFound|Found MISC tag without corresponding file in miscellaneous files configuration. For more information, see [Miscellaneous files](./trino-miscellaneous-files.md).
|User.Configuration.MiscFile.DuplicateName|Duplicate fileName value found in [Miscellaneous files](./trino-miscellaneous-files.md) configuration section.
|User.Configuration.MiscFile.DuplicatePath|Duplicate path value found in [Miscellaneous files](./trino-miscellaneous-files.md) configuration section.
|User.Configuration.FormatError|Malformed service configuration, content/values properties used in wrong sections. For more information, see [Service configuration profile](./trino-service-configuration.md).
|User.Configuration.HiveMetastore.MultiplePasswords|Multiple passwords specified in catalogOptions.hive catalog. Specify one of two properties either metastoreDbConnectionPasswordSecret or metastoreDbConnectionPassword.
|User.Configuration.HiveMetastore.PasswordRequired|Password required for catalogOptions.hive catalog. Specify one of two properties either metastoreDbConnectionPasswordSecret or metastoreDbConnectionPassword.
|User.Secrets.Error|Misconfigured secrets or permissions in Azure KeyVault.
|User.Secrets.InvalidKeyVaultUri|Missing Azure Key Vault URI in secretsProfile.
|User.Secrets.KeyVaultUriRequired|Missing Azure Key Vault URI in secretsProfile.
|User.Secrets.DuplicateReferenceName|Duplicate referenceName found in secretsProfile.
|User.Secrets.KeyVaultObjectUsedMultipleTimes|Same key vault object/version used multiple times as different references in secrets list in secretsProfile.
|User.Secrets.NotSpecified|Found SECRET_REF tag without corresponding secret object in secretsProfile.
|User.Secrets.NotFound|Specified Key Vault object in secretsProfile not found in KeyVault. Verify name, type and version of the object.
|User.Plugins.Error|Misconfigured plugins or permissions in storage account.
|User.Plugins.DuplicateName|Duplicate plugin name used in cluster configuration userPluginsSpec.
|User.Plugins.DuplicatePath|Duplicate plugin path used in cluster configuration userPluginsSpec.
|User.Plugins.InvalidPath|Malformed storage URI for a plugin.
|User.Plugins.PathNotFound|Specified path for a plugin not found in storage account.
|User.Telemetry.InvalidStoragePath|Malformed storage URI in userTelemetrySpec.
|User.Telemetry.HiveCatalogNotFound|Nonexistent Hive catalog specified as target for telemetry tables in userTelemetrySpec.
|User.CatalogOptions.HiveCatalogNotFound|Hive catalog not found in trino catalogs [Service configuration profile](./trino-service-configuration.md) for a given catalogOptions.hive configuration. For more information, see [Hive metastore](./trino-connect-to-metastore.md).

## System errors
Some of the errors may occur due to environment conditions and be transient. These errors have reason starting with "System." as prefix. In such cases, try the following steps:

1. Collect the following information:
    1. **Azure request CorrelationId**. It can be found either in Notifications area; or under Resource Group where cluster is located, on Deployments page; or in az command output.
    1. **DeploymentId**. It can be found in the Cluster Overview page.
    1. Detailed error message.
1. Contact support team with this information.

|Error code|Description
|----|----|
|System.DependencyFailure|Failure in one of cluster components.
