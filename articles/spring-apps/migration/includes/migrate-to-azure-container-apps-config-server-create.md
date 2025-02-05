## Provision Config Server

### [Azure portal](#tab/Azure-portal)

The following steps show you how to provision a Config Server for Spring in your Azure Container Apps:

1. Navigate to your Azure Container Apps environment in the Azure portal.

1. In the menu, select **Services** > **Services**.

1. Open the **Configure** drop-down list, and then select **Java component**.

1. In the **Configure Java component** panel, enter the following values:

   | Property                | Value                                |
   |-------------------------|--------------------------------------|
   | **Java component type** | Select **Config Server for Spring**. |
   | **Java component name** | Enter **configserver**.              |

1. In the **Git repositories** section, select **Add**, and then migrate the values from Application Configuration Service to here, as shown in the following table. Choose one repository as the default repository of Config Server for Spring.

   | Property           | Value                                                                                     |
   |--------------------|-------------------------------------------------------------------------------------------|
   | **Type**           | Select **DEFAULT**.                                                                       |
   | **URI**            | Enter the value of **URI** of the repository.                                             |
   | **Branch name**    | Enter the value of **label** of the repository.                                           |
   | **Search paths**   | Enter the value of **search path** of the repository.                                     |
   | **Authentication** | Select the authentication type of the repository and enter the corresponding information. |

   Leave the rest of the fields with the default values and then select **Add**.

1. If you have multiple repositories, select **Add** to migrate other repositories. For **Type**, select **Other**, and then migrate other properties as shown in the previous step and the following table:

   | Property    | Value                                                                                                       |
   |-------------|-------------------------------------------------------------------------------------------------------------|
   | **Type**    | Select **DEFAULT**.                                                                                         |
   | **Pattern** | Enter the **Patterns** value for the repository in the `{application}` or `{application}/{profile}` format. |

1. In the **Binding** section, open the dropdown to select the apps to bind to the Config Server for Spring.

1. Select **Next**.

1. To set up Config Server, on the **Review** tab, select **Configure**, and then follow the instructions in the configuration section.

After successful creation, you can see that the **Provisioning State** of Config Server for Spring is **Succeeded**.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to create and configure the Config Server for Spring Java component:

```azurecli
az containerapp env java-component config-server-for-spring create \
    --resource-group <resource-group-name> \
    --name <config-server-name> \
    --environment <azure-container-app-environment-name> \
    --min-replicas 1 \
    --max-replicas 1 \
    --configuration spring.cloud.config.server.git.uri=<URI> spring.cloud.config.server.git.default-label=<label>
```

All properties are set using the format `--configuration <CONFIGURATION_KEY>=<CONFIGURATION_VALUE>`. To map existing configurations to the key-value pairs of the Config Server, see the configuration section.

---

### Resource allocation

The container resource allocation for the managed Config Server in Azure Container Apps is fixed to the following values:

- **CPU**: 0.5 vCPU
- **Memory**: 1 Gi

To configure the instance count of Config Server for Spring, you need to update the parameters `--min-replicas` and `--max-replicas` with the same value. This configuration ensures that the instance count remains fixed. Currently, the system doesn't support autoscaling configurations for dynamic scaling.
