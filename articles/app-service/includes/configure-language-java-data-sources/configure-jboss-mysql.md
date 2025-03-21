---
author: cephalin
ms.service: azure-app-service
ms.devlang: java
ms.topic: include
ms.date: 11/05/2024
ms.author: cephalin
---

1. Put your JBoss CLI commands into a file named *jboss-cli-commands.cli*. The JBoss commands must add the module and register it as a data source. The following example shows the JBoss CLI commands for creating a MySQL data source with the JNDI name `java:jboss/datasources/mysqlDS`.

    ```bash
    module add --name=com.mysql.mysql-connector-j --resources=/home/site/libs/mysql-connector-j-9.1.0.jar
    /subsystem=datasources/jdbc-driver=mysql:add(driver-name="mysql",driver-module-name="com.mysql.mysql-connector-j",driver-class-name="com.mysql.cj.jdbc.Driver",driver-xa-datasource-class-name="com.mysql.cj.jdbc.MysqlXADataSource")
    data-source add --name=mysql --driver-name="mysql" --jndi-name="java:jboss/datasources/mysqlDS" --connection-url="jdbc:mysql://\${env.DB_HOST}:5432/mysql?serverTimezone=UTC" --user-name="\${env.DB_USERNAME}" --password="\${env.DB_PASSWORD}" --enabled=true --use-java-context=true
    ```

    Note that the `module add` command uses three environment variables (`DB_HOST`, `DB_USERNAME`, and `DB_PASSWORD`), which you must add in App Service as app settings. The script adds them without the `--resolve-parameter-values` flag so that JBoss doesn't save their values in plaintext.

1. Create a startup script, *startup.sh*, that calls the JBoss CLI commands. The following example shows how to call your `jboss-cli-commands.cli`. Later, you'll configure App Service to run this script when the container starts.

    ```bash
    $JBOSS_HOME/bin/jboss-cli.sh --connect --file=/home/site/scripts/jboss_cli_commands.cli
    ```

1. Using a deployment option of your choice, upload your JDBC driver, *jboss-cli-commands.cli*, and *startup.sh* to the paths specified in the respective scripts. Especially, upload *startup.sh* as a startup file. For example:

    # [Azure CLI](#tab/cli)

    ```azurecli-interactive
    export RESOURCE_GROUP_NAME=<resource-group-name>
    export APP_NAME=<app-name>

    # The lib type uploads to /home/site/libs by default.
    az webapp deploy --resource-group $RESOURCE_GROUP_NAME --name $APP_NAME --src-path mysql-connector-j-9.1.0.jar --target-path mysql-connector-j-9.1.0.jar --type lib
    az webapp deploy --resource-group $RESOURCE_GROUP_NAME --name $APP_NAME --src-path jboss_cli_commands.cli --target-path /home/site/scripts/jboss_cli_commands.cli --type static
    # The startup type uploads to /home/site/scripts/startup.sh by default.
    az webapp deploy --resource-group $RESOURCE_GROUP_NAME --name $APP_NAME --src-path startup.sh --type startup
    ```

    For more information, see [Deploy files to App Service](../../deploy-zip.md).

    # [Azure Maven Plugin](#tab/maven)

    ```xml
    <deployment>
        <resources>
            <resource>
                <!-- The lib type uploads to /home/site/libs by default. -->
                <type>lib</type>
                <directory>${project.build.directory}/${project.artifactId}/META-INF/lib</directory> <!-- Assume driver is part of POM dependencies. -->
                <includes>
                    <include>mysql-connector-j-9.1.0.jar</include>
                </includes>
            </resource>
            <resource>
                <!-- The script type uploads to /home/site/scripts by default. -->
                <type>script</type>
                <directory>${project.scriptSourceDirectory}</directory> <!-- Assume script is in src/main/scripts. -->
                <includes>
                    <include>jboss_cli_commands.cli</include>
                </includes>
            </resource>
            <resource>
                <!-- The startup type uploads to /home/site/scripts/startup.sh by default -->
                <type>startup</type>
                <directory>${project.scriptSourceDirectory}</directory> <!-- Assume script is in src/main/scripts. -->
                <includes>
                    <include>startup.sh</include>
                </includes>
            </resource>
            ...
        </resources>
    </deployment>
    ```

    # [Azure Pipelines](#tab/pipelines)

    ```YAML
    variables: # Set <subscription-id>, <resource-group-name>, <app-name> for your environment
    - name: SUBSCRIPTION_ID
      value: <subscription-id>
    - name: RESOURCE_GROUP_NAME
      value: <resource-group-name>
    - name: APP_NAME
      value: <app-name>
    
    steps: 
    - task: AzureCLI@2
      displayName: Azure CLI
      inputs:
        azureSubscription: $(SUBSCRIPTION_ID)
        scriptType: bash
        scriptLocation: inlineScript
        inlineScript: |
          # The lib type uploads to /home/site/libs by default.
          az webapp deploy --resource-group $(RESOURCE_GROUP_NAME) --name $(APP_NAME) --src-path mysql-connector-j-9.1.0.jar --target-path mysql-connector-j-9.1.0.jar --type lib
          az webapp deploy --resource-group $(RESOURCE_GROUP_NAME) --name $(APP_NAME) --src-path jboss_cli_commands.cli --target-path /home/site/scripts/jboss_cli_commands.cli --type static
          # The startup type uploads to /home/site/scripts/startup.sh by default.
          az webapp deploy --resource-group $(RESOURCE_GROUP_NAME) --name $(APP_NAME) --src-path startup.sh --type startup
    ```

    ---

To confirm that the data source was added to the JBoss server, SSH into your webapp and run `$JBOSS_HOME/bin/jboss-cli.sh --connect`. Once you're connected to JBoss, run the `/subsystem=datasources:read-resource` to print a list of the data sources.

As defined by *jboss-cli-commands.cli* previously, you can access the MySQL connection using the JNDI name `java:jboss/datasources/mysqlDS`.
