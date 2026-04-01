---
title: Migrate Tomcat applications to Azure Container Apps
description: Learn how to assess, containerize, and deploy an existing Tomcat application to Azure Container Apps.
ms.author: deepganguly
author: deepganguly
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 03/11/2026
---

# Migrate Tomcat applications to Azure Container Apps

This guide walks you through the process of migrating an existing Tomcat application to Azure Container Apps. It covers pre-migration assessment, the migration itself, and post-migration optimization.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) installed, or access to the [Azure portal](https://portal.azure.com).
- Familiarity with Apache Tomcat administration, WAR packaging, and Docker containers.
- A supported JDK version (8, 11, 17, or 21). For more information, see [Java on Azure Container Apps overview](java-overview.md).
- Docker (optional - only needed if you build images locally).

## pre-migration assessment

Before you start the migration, complete the assessment and inventory steps described in the following sections.

### Inventory external resources

You inject external resources, such as data sources, JMS message brokers, and others, by using Java Naming and Directory Interface (JNDI). Some of these resources might require migration or reconfiguration.

#### Inside your application

Inspect the *META-INF/context.xml* file. Look for `<Resource>` elements inside the `<Context>` element.

#### On the application servers

Inspect the *$CATALINA_BASE/conf/context.xml* and *$CATALINA_BASE/conf/server.xml* files. Also inspect the *.xml* files in *$CATALINA_BASE/conf/\<engine-name\>/\<host-name\>* directories.

In *context.xml* files, you describe JNDI resources by using `<Resource>` elements inside the top-level `<Context>` element.

In *server.xml* files, you describe JNDI resources by using `<Resource>` elements inside the `<GlobalNamingResources>` element.

#### Data sources

Data sources are JNDI resources with the `type` attribute set to `javax.sql.DataSource`. For each data source, document the following information:

- What is the data source name?
- What is the connection pool configuration?
- Where is the JDBC driver JAR file?

For more information, see [JNDI Datasource HOW-TO](https://tomcat.apache.org/tomcat-9.0-doc/jndi-datasource-examples-howto.html) in the Tomcat documentation.

#### All other external resources

It's not feasible to document every possible external dependency in this guide. Your team is responsible for verifying that you can satisfy every external dependency of your application after the migration.

### Inventory secrets and certificates

#### Passwords and secure strings

Check all properties and configuration files on the production servers for any secret strings and passwords. Be sure to check *server.xml* and *context.xml* in *$CATALINA_BASE/conf*. You might also find configuration files containing passwords or credentials inside your application, including *META-INF/context.xml* and, for Spring Boot applications, *application.properties* or *application.yml* files.

#### Certificates

[!INCLUDE [migrate-java-pre-migration-certificates](includes/migrate-java-pre-migration-certificates.md)]

### Review file system usage

[!INCLUDE [migrate-java-pre-migration-file-system](includes/migrate-java-pre-migration-file-system.md)]

If your application currently serves static content from the Tomcat *webapps/* directory, plan to move that content to an external storage solution as part of the migration.

### Check for OS-specific code

[!INCLUDE [migrate-java-pre-migration-os-code](includes/migrate-java-pre-migration-os-code.md)]

### Verify platform compatibility

If you manually create your Dockerfile and deploy a containerized application to Azure Container Apps, you have full control over your deployment, including JRE/JDK versions and Tomcat versions.

Before you create container images, migrate your application to the JDK and Tomcat versions that you intend to use on Container Apps. Test your application thoroughly to ensure compatibility and performance.

> [!NOTE]
> This validation is especially important if your current server runs on an unsupported JDK, such as Oracle JDK or IBM OpenJ9.

To check your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

### Identify session persistence mechanism

To identify the session persistence manager in use, inspect the *context.xml* files in your application and Tomcat configuration. Look for the `<Manager>` element, and then note the value of the `className` attribute.

Tomcat's built-in [PersistentManager](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html) implementations, such as [StandardManager](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html#Standard_Implementation) or [FileStore](https://tomcat.apache.org/tomcat-9.0-doc/config/manager.html#Nested_Components), aren't designed for use with a distributed, scaled platform such as Azure Container Apps. Container Apps might load balance among several instances and transparently restart any instance at any time, so persisting mutable state to a file system isn't recommended.

If you require session persistence, use an alternate `PersistentManager` implementation that writes to an external data store, such as VMware Tanzu Session Manager with Redis Cache.

### Identify scheduled jobs

You can't use scheduled jobs, such as Quartz Scheduler tasks or cron jobs, with containerized Tomcat deployments. If you scale out your application, one scheduled job might run more than once per scheduled period, which can lead to unintended consequences.

Inventory any scheduled jobs, inside or outside the application server. Short-lived or batch-style tasks are good candidates for Container Apps jobs. For more information, see [Jobs in Azure Container Apps](jobs.md).

### Determine whether MemoryRealm is used

[MemoryRealm](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/realm/MemoryRealm.html) requires a persisted XML file. On Azure Container Apps, you need to add this file to the container image or upload it to shared storage that you make available to containers. For more information, see the [Identify session persistence mechanism](#identify-session-persistence-mechanism) section. You must modify the `pathName` parameter accordingly.

To determine whether `MemoryRealm` is currently used, inspect your *server.xml* and *context.xml* files. Search for `<Realm>` elements where the `className` attribute is set to `org.apache.catalina.realm.MemoryRealm`.

### Parameterize the configuration

During the pre-migration, you likely identified secrets and external dependencies, such as data sources, in *server.xml* and *context.xml* files. For each item, replace any username, password, connection string, or URL with an environment variable.

> [!NOTE]
> Use the most secure authentication flow available. The authentication flow described in this procedure, such as for databases, caches, messaging, or AI services, requires a very high degree of trust in the application and carries risks not present in other flows. Use this flow only when more secure options, like managed identities for passwordless or keyless connections, aren't viable. For local machine operations, prefer user identities for passwordless or keyless connections.

For example, suppose the *context.xml* file contains the following element:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="jdbc:postgresql://postgresdb.contoso.com/wickedsecret?ssl=true"
    driverClassName="org.postgresql.Driver"
    username="postgres"
    password="{password}"
/>
```

You can change it as shown in the following example:

```xml
<Resource
    name="jdbc/dbconnection"
    type="javax.sql.DataSource"
    url="${postgresdb.connectionString}"
    driverClassName="org.postgresql.Driver"
    username="${postgresdb.username}"
    password="${postgresdb.password}"
/>
```

### Assess logging and APM

Identify any log aggregation solutions that the applications you're migrating use. You need to configure diagnostic settings during migration so that logged events are available for consumption. For more information, see the [Configure logging and diagnostics](#configure-logging-and-diagnostics) section.

Identify any application performance management (APM) agents that your applications use. Azure Container Apps doesn't offer built-in APM support. Prepare your container image or integrate the APM tool directly into your code. If you want to measure your application's performance but have yet to integrate any APM yet, consider using Azure Application Insights with the auto-instrumentation Java agent. For more information, see [Enable Azure Monitor OpenTelemetry for Java applications](/azure/azure-monitor/app/opentelemetry-enable?tabs=java).

### Document deployment architecture

Document the following information for your Tomcat application:

- The number of instances running.
- The number of CPUs allocated to each instance.
- The amount of RAM allocated to each instance.

Also determine whether you distribute your application instances among several regions or data centers. Document the uptime requirements and SLA for the applications you're migrating.

## Migration

### Create a Container Apps environment

Create a Container Apps environment in your Azure subscription. For more information, see [Quickstart: Deploy your first container app using the Azure portal](quickstart-portal.md).

### Configure logging and diagnostics

Configure your logging to route all output to the console instead of to files.

After you deploy the application to Azure Container Apps, you can configure the logging options within your Container Apps environment to define one or more log destinations. These destinations can include Azure Monitor Log Analytics, Azure Event Hubs, or non-Microsoft monitoring solutions. You can also disable log data storage and view logs only at runtime. For configuration instructions, see [Log storage and monitoring options in Azure Container Apps](log-options.md).

### Configure persistent storage

If any part of your application reads or writes to the local file system, configure persistent storage to replace it. For example, if your Tomcat application writes logs or uploads to */opt/tomcat/data*, create an Azure Files share and mount it to the same path:

```azurecli
az containerapp update \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --set-env-vars "UPLOAD_DIR=/opt/tomcat/data"
```

Specify the path to mount in the container through the app settings and align it with the path your application uses. For more information, see [Use storage mounts in Azure Container Apps](storage-mounts.md).

### Migrate certificates to Azure Key Vault

Azure Container Apps supports secure communication between apps. Your application doesn't need to manage the process of establishing secure communication. You can upload a private certificate to Azure Container Apps or use a free managed certificate. Using Azure Key Vault to manage certificates is the recommended approach.

To store a certificate in Key Vault and reference it from your container app:

1. Import the certificate into Azure Key Vault. For more information, see [Import a certificate in Azure Key Vault](/azure/key-vault/certificates/tutorial-import-certificate).
1. Enable a managed identity on your container app and grant it the **Key Vault Secrets User** role on the vault.
1. Configure the container app to use the Key Vault certificate for custom domains.

For more information, see [Certificates in Azure Container Apps](certificates-overview.md).

### Prepare the deployment artifacts

Clone the [Tomcat on Containers Quickstart](https://github.com/Azure/tomcat-container-quickstart) GitHub repository. This repository contains a Dockerfile and Tomcat configuration files with many recommended optimizations. The following steps outline modifications you likely need to make to these files before building the container image and deploying to Container Apps.

> [!NOTE]
> Some Tomcat deployments run multiple applications on a single Tomcat server. If this setup matches your deployment, run each application in a separate container app. By using this approach, you can optimize resource utilization for each application while minimizing complexity and coupling.

#### Add JNDI resources

Edit *server.xml* to add the resources you prepared in the pre-migration steps, such as data sources, as shown in the following example:

> [!NOTE]
> Use the most secure authentication flow available. The authentication flow described in this procedure, such as for databases, caches, messaging, or AI services, requires a high degree of trust in the application and carries risks not present in other flows. Use this flow only when more secure options, like managed identities for passwordless, or keyless connections, aren't viable. For local machine operations, prefer user identities for passwordless or keyless connections.

```xml
<!-- Global JNDI resources
      Documentation at /docs/jndi-resources-howto.html
-->
<GlobalNamingResources>
    <!-- Editable user database that can also be used by
         UserDatabaseRealm to authenticate users
    -->
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml"
               />

    <!-- Migrated datasources here: -->
    <Resource
        name="jdbc/dbconnection"
        type="javax.sql.DataSource"
        url="${postgresdb.connectionString}"
        driverClassName="org.postgresql.Driver"
        username="${postgresdb.username}"
        password="${postgresdb.password}"
    />
    <!-- End of migrated datasources -->
</GlobalNamingResources>
```

For more data source instructions, see the following sections of the [JNDI Datasource How-To](https://tomcat.apache.org/tomcat-9.0-doc/jndi-datasource-examples-howto.html) in the Tomcat documentation:

- [MySQL](https://tomcat.apache.org/tomcat-9.0-doc/jndi-datasource-examples-howto.html#MySQL_DBCP_2_Example)
- [PostgreSQL](https://tomcat.apache.org/tomcat-9.0-doc/jndi-datasource-examples-howto.html#PostgreSQL)
- [SQL Server](https://cwiki.apache.org/confluence/display/TOMCAT/UsingDataSources)

### Build and push the image

The simplest way to build and upload the image to Azure Container Registry (ACR) for use by Container Apps is to use the `az acr build` command. This command doesn't require Docker to be installed on your computer. For example, if you have the Dockerfile from the [tomcat-container-quickstart](https://github.com/Azure/tomcat-container-quickstart) repo and the application package *petclinic.war* in the current directory, you can build the container image in ACR with the following command:

```azurecli
az acr build \
    --registry $acrName \
    --image "${acrName}.azurecr.io/petclinic:{{.Run.ID}}" \
    --build-arg APP_FILE=petclinic.war \
    --build-arg SERVER_XML=prod.server.xml .
```

You can omit the `--build-arg APP_FILE...` parameter if your WAR file is named *ROOT.war*. You can omit the `--build-arg SERVER_XML...` parameter if your server XML file is named *server.xml*. Both files must be in the same directory as the Dockerfile.

Alternatively, you can use Docker CLI to build the image locally by using the following commands. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires Docker CLI to be installed and Docker daemon to be running.

```azurecli
# Build the image locally.
docker build . --build-arg APP_FILE=petclinic.war -t "${acrName}.azurecr.io/petclinic:1"

# Run the image locally.
docker run -d -p 8080:8080 "${acrName}.azurecr.io/petclinic:1"

# You can now access your application with a browser at http://localhost:8080.

# Sign in to ACR.
az acr login --name $acrName

# Push the image to ACR.
docker push "${acrName}.azurecr.io/petclinic:1"
```

> [!NOTE]
> On Linux, you might need to prefix the `docker` commands with `sudo` if your user isn't in the `docker` group.

For more information, see [Build and store container images with Azure Container Registry](/training/modules/build-and-store-container-images/).

### Deploy to Azure Container Apps

The following command shows an example deployment:

```azurecli
az containerapp create \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --environment <ENVIRONMENT_NAME> \
    --image <IMAGE_NAME> \
    --target-port 8080 \
    --ingress 'external' \
    --registry-server <REGISTRY_SERVER> \
    --min-replicas 1
```

For a more in-depth quickstart, see [Quickstart: Deploy your first container app](get-started.md).

### Configure secrets and environment variables

Inject configuration settings into each application as environment variables. Set these variables as manual entries or as references to secrets. For more information, see [Manage environment variables on Azure Container Apps](environment-variables.md) and [Manage secrets in Azure Container Apps](manage-secrets.md).

### Set up identity and authentication

If your Tomcat application requires authentication or authorization, ensure the configuration is set to access the identity provider:

- If the identity provider is Microsoft Entra ID, don't make any changes.
- If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Microsoft Entra ID. For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
- If the identity provider is another on-premises solution, such as PingFederate, see [Custom installation of Microsoft Entra Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) to configure federation with Microsoft Entra ID.

If your application uses a Tomcat Realm for authentication (for example, `MemoryRealm` or `JDBCRealm`), plan to migrate to an external identity provider or configure the realm within your container image.

### Expose the application

By default, an application deployed to Azure Container Apps isn't accessible from outside the environment. To enable external access, configure ingress:

```azurecli
az containerapp ingress enable \
    --resource-group <RESOURCE_GROUP> \
    --name <APP_NAME> \
    --type external \
    --target-port 8080 \
    --transport auto
```

If you deploy your app in a managed environment with its own virtual network, determine the app's accessibility level to allow public ingress or ingress from your virtual network only. For more information, see [Networking in Azure Container Apps environment](networking.md).

## Post-migration

After you complete the migration, verify that your application works as expected. The following sections describe recommendations for making your application more cloud-native and operationally robust.

### Improve operational readiness

The following recommendations help you strengthen reliability, observability, and deployment practices for your migrated application.

[!INCLUDE [migrate-java-post-migration-operations](includes/migrate-java-post-migration-operations.md)]

### Tomcat-specific recommendations

- To improve performance, evaluate the items in the *logging.properties* file. Consider eliminating or reducing some of the logging output.

- Consider monitoring the code cache size and adding the parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` to the `JAVA_OPTS` variable in the Dockerfile to further optimize performance. For more information, see [Codecache Tuning](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) in the Oracle documentation.

## Related content

- [Java on Azure Container Apps overview](java-overview.md)
- [Quickstart: Deploy your first container app using the Azure portal](quickstart-portal.md)
- [Migrate Spring Boot applications to Azure Container Apps](migrate-spring-boot.md)
- [Migrate Spring Cloud applications to Azure Container Apps](migrate-spring-cloud.md)
