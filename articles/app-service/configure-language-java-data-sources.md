---
title: Configure data sources for Tomcat, JBoss, or Java SE apps
description: Learn how to configure data sources for Tomcat, JBoss, or Java SE apps on Azure App Service, including native Windows and Linux container variants.
keywords: azure app service, web app, windows, oss, java, tomcat, jboss
ms.devlang: java
ms.topic: article
ms.date: 07/17/2024
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java, linux-related-content
zone_pivot_groups: app-service-java-hosting
adobe-target: true
author: cephalin
ms.author: cephalin
---

# Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service

This article shows how to configure data sources in a Java SE, Tomcat, or JBoss app in App Service.

[!INCLUDE [java-variants](includes/configure-language-java/java-variants.md)]

## Configure the data source

::: zone pivot="java-javase"

To connect to data sources in Spring Boot applications, we suggest creating connection strings and injecting them into your *application.properties* file.

1. In the "Configuration" section of the App Service page, set a name for the string, paste your JDBC connection string into the value field, and set the type to "Custom". You can optionally set this connection string as slot setting.

    This connection string is accessible to our application as an environment variable named `CUSTOMCONNSTR_<your-string-name>`. For example, `CUSTOMCONNSTR_exampledb`.

2. In your *application.properties* file, reference this connection string with the environment variable name. For our example, we would use the following code:

    ```yml
    app.datasource.url=${CUSTOMCONNSTR_exampledb}
    ```

For more information, see the [Spring Boot documentation on data access](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-data-access.html) and [externalized configurations](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html).

::: zone-end

::: zone pivot="java-tomcat"

> [!TIP]
> By default, the Linux Tomcat containers can automatically configure shared data sources for you in the Tomcat server. The only thing for you to do is add an app setting that contains a valid JDBC connection string to an Oracle, SQL Server, PostgreSQL, or MySQL database (including the connection credentials), and App Service automatically adds the cooresponding shared database to */usr/local/tomcat/conf/context.xml* for you, using an appropriate driver available in the container. For an end-to-end scenario using this approach, see [Tutorial: Build a Tomcat web app with Azure App Service on Linux and MySQL](tutorial-java-tomcat-mysql-app.md).

These instructions apply to all database connections. You need to fill placeholders with your chosen database's driver class name and JAR file. Provided is a table with class names and driver downloads for common databases.

| Database   | Driver Class Name                             | JDBC Driver                                                                      |
|------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| PostgreSQL | `org.postgresql.Driver`                        | [Download](https://jdbc.postgresql.org/download/)                                    |
| MySQL      | `com.mysql.jdbc.Driver`                        | [Download](https://dev.mysql.com/downloads/connector/j/) (Select "Platform Independent") |
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server#download)                                                           |

To configure Tomcat to use Java Database Connectivity (JDBC) or the Java Persistence API (JPA), first customize the `CATALINA_OPTS` environment variable that is read in by Tomcat at start-up. Set these values through an app setting in the [App Service Maven plugin](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md):

```xml
<appSettings>
    <property>
        <name>CATALINA_OPTS</name>
        <value>"$CATALINA_OPTS -Ddbuser=${DBUSER} -Ddbpassword=${DBPASSWORD} -DconnURL=${CONNURL}"</value>
    </property>
</appSettings>
```

Or set the environment variables in the **Configuration** > **Application Settings** page in the Azure portal.

Next, determine if the data source should be available to one application or to all applications running on the Tomcat servlet.

### Application-level data sources

1. Create a *context.xml* file in the *META-INF/* directory of your project. Create the *META-INF/* directory if it doesn't exist.

2. In *context.xml*, add a `Context` element to link the data source to a JNDI address. Replace the `driverClassName` placeholder with your driver's class name from the table above.

    ```xml
    <Context>
        <Resource
            name="jdbc/dbconnection"
            type="javax.sql.DataSource"
            url="${connURL}"
            driverClassName="<insert your driver class name>"
            username="${dbuser}"
            password="${dbpassword}"
        />
    </Context>
    ```

3. Update your application's *web.xml* to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/dbconnection</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

### Shared server-level resources

# [Windows](#tab/windows)

You can't directly modify a Tomcat installation for server-wide configuration because the installation location is read-only. To make server-level configuration changes to your Windows Tomcat installation, the simplest way is to do the following on app start: 

1. Copy Tomcat to a local directory (`%LOCAL_EXPANDED%`) and use that as `CATALINA_BASE` (see [Tomcat documentation on this variable](https://tomcat.apache.org/tomcat-10.1-doc/introduction.html)).
1. Add your shared data sources to `%LOCAL_EXPANDED%\tomcat\conf\server.xml` using XSL transform.

#### Add a startup file

Create a file named `startup.cmd` `%HOME%\site\wwwroot` directory. This file runs automatically before the Tomcat server starts. The file should have the following content:

```dos
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -File  %HOME%\site\configure.ps1
```

#### Add the PowerShell configuration script

Next, add the configuration script called *configure.ps1* to the *%HOME%_\site* directory with the following code:

```powershell
# Locations of xml and xsl files
$target_xml="$Env:LOCAL_EXPANDED\tomcat\conf\server.xml"
$target_xsl="$Env:HOME\site\server.xsl"

# Define the transform function
# Useful if transforming multiple files
function TransformXML{
    param ($xml, $xsl, $output)

    if (-not $xml -or -not $xsl -or -not $output)
    {
        return 0
    }

    Try
    {
        $xslt_settings = New-Object System.Xml.Xsl.XsltSettings;
        $XmlUrlResolver = New-Object System.Xml.XmlUrlResolver;
        $xslt_settings.EnableScript = 1;

        $xslt = New-Object System.Xml.Xsl.XslCompiledTransform;
        $xslt.Load($xsl,$xslt_settings,$XmlUrlResolver);
        $xslt.Transform($xml, $output);
    }

    Catch
    {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName
        echo  'Error'$ErrorMessage':'$FailedItem':' $_.Exception;
        return 0
    }
    return 1
}

# Start here

# Check for marker file indicating that config has already been done
if(Test-Path "$Env:LOCAL_EXPANDED\tomcat\config_done_marker"){
    return 0
}

# Delete previous Tomcat directory if it exists
# In case previous config isn't completed or a new config should be forcefully installed
if(Test-Path "$Env:LOCAL_EXPANDED\tomcat"){
    Remove-Item "$Env:LOCAL_EXPANDED\tomcat" Recurse
}

md -Path "$Env:LOCAL_EXPANDED\tomcat"

# Copy Tomcat to local
# Using the environment variable $AZURE_TOMCAT90_HOME uses the 'default' version of Tomcat
New-Item "$Env:LOCAL_EXPANDED\tomcat" -ItemType Directory
Copy-Item -Path "$Env:AZURE_TOMCAT90_HOME\*" "$Env:LOCAL_EXPANDED\tomcat" -Recurse

# Perform the required customization of Tomcat
$success = TransformXML -xml $target_xml -xsl $target_xsl -output $target_xml

# Mark that the operation was a success if successful
if($success){
    New-Item -Path "$Env:LOCAL_EXPANDED\tomcat\config_done_marker" -ItemType File
}
```

This PowerShell completes the following steps:

1. Check whether a custom Tomcat copy exists already. If it does, the startup script can end here.
2. Copy Tomcat locally.
3. Add shared data sources to the custom Tomcat's configuration using XSL transform.
4. Indicate that configuration was successfully completed.

#### Add XSL transform file

A common use case for customizing the built-in Tomcat installation is to modify the `server.xml`, `context.xml`, or `web.xml` Tomcat configuration files. App Service already modifies these files to provide platform features. To continue to use these features, it's important to preserve the content of these files when you make changes to them. To accomplish this, use an [XSL transformation (XSLT)](https://www.w3schools.com/xml/xsl_intro.asp).

Add an XSL transform file called *configure.ps1* to the *%HOME%_\site* directory. You can use the following XSL transform code to add a new connector node to `server.xml`. The *identity transform* at the beginning  preserves the original contents of the configuration file.

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
  
    <!-- Identity transform: this ensures that the original contents of the file are included in the new file -->
    <!-- Ensure that your transform files include this block -->
    <xsl:template match="@* | node()" name="Copy">
      <xsl:copy>
        <xsl:apply-templates select="@* | node()"/>
      </xsl:copy>
    </xsl:template>
  
    <xsl:template match="@* | node()" mode="insertConnector">
      <xsl:call-template name="Copy" />
    </xsl:template>
  
    <xsl:template match="comment()[not(../Connector[@scheme = 'https']) and
                                   contains(., '&lt;Connector') and
                                   (contains(., 'scheme=&quot;https&quot;') or
                                    contains(., &quot;scheme='https'&quot;))]">
      <xsl:value-of select="." disable-output-escaping="yes" />
    </xsl:template>
  
    <xsl:template match="Service[not(Connector[@scheme = 'https'] or
                                     comment()[contains(., '&lt;Connector') and
                                               (contains(., 'scheme=&quot;https&quot;') or
                                                contains(., &quot;scheme='https'&quot;))]
                                    )]
                        ">
      <xsl:copy>
        <xsl:apply-templates select="@* | node()" mode="insertConnector" />
      </xsl:copy>
    </xsl:template>
  
    <!-- Add the new connector after the last existing Connnector if there's one -->
    <xsl:template match="Connector[last()]" mode="insertConnector">
      <xsl:call-template name="Copy" />
  
      <xsl:call-template name="AddConnector" />
    </xsl:template>
  
    <!-- ... or before the first Engine if there's no existing Connector -->
    <xsl:template match="Engine[1][not(preceding-sibling::Connector)]"
                  mode="insertConnector">
      <xsl:call-template name="AddConnector" />
  
      <xsl:call-template name="Copy" />
    </xsl:template>
  
    <xsl:template name="AddConnector">
      <!-- Add new line -->
      <xsl:text>&#xa;</xsl:text>
      <!-- This is the new connector -->
      <Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true" 
                 maxThreads="150" scheme="https" secure="true" 
                 keystoreFile="${{user.home}}/.keystore" keystorePass="changeit"
                 clientAuth="false" sslProtocol="TLS" />
    </xsl:template>

</xsl:stylesheet>
```

#### Set `CATALINA_BASE` app setting

The platform also needs to know where your custom version of Tomcat is installed. You can set the installation's location in the `CATALINA_BASE` app setting.

You can use the Azure CLI to change this setting:

```azurecli
    az webapp config appsettings set -g $MyResourceGroup -n $MyUniqueApp --settings CATALINA_BASE="%LOCAL_EXPANDED%\tomcat"
```

Or, you can manually change the setting in the Azure portal:

1. Go to **Settings** > **Configuration** > **Application settings**.
1. Select **New Application Setting**.
1. Use these values to create the setting:
   1. **Name**: `CATALINA_BASE`
   1. **Value**: `"%LOCAL_EXPANDED%\tomcat"`

#### Finalize configuration

Finally, you place the driver JARs in the Tomcat classpath and restart your App Service. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/site/lib* directory. In the [Cloud Shell](https://shell.azure.com), run `az webapp deploy --type=lib` for each driver JAR:

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path <jar-name>.jar --type=lib --target-path <jar-name>.jar
```

# [Linux](#tab/linux)

Adding a shared, server-level data source requires you to edit Tomcat's server.xml. The most reliable way to do this is as follows:

1. Upload a [startup script](./faq-app-service-linux.yml) and set the path to the script in **Configuration** > **Startup Command**. You can upload the startup script using [FTP](deploy-ftp.md).

Your startup script makes an [xsl transform](https://www.w3schools.com/xml/xsl_intro.asp) to the server.xml file and output the resulting xml file to `/usr/local/tomcat/conf/server.xml`. The startup script should install libxslt via apk. Your xsl file and startup script can be uploaded via FTP. Below is an example startup script.

```sh
# Install libxslt. Also copy the transform file to /home/tomcat/conf/
apk add --update libxslt

# Usage: xsltproc --output output.xml style.xsl input.xml
xsltproc --output /home/tomcat/conf/server.xml /home/tomcat/conf/transform.xsl /usr/local/tomcat/conf/server.xml
```

The following example XSL file adds a new connector node to the Tomcat server.xml.

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="@* | node()" name="Copy">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@* | node()" mode="insertConnector">
    <xsl:call-template name="Copy" />
  </xsl:template>

  <xsl:template match="comment()[not(../Connector[@scheme = 'https']) and
                                 contains(., '&lt;Connector') and
                                 (contains(., 'scheme=&quot;https&quot;') or
                                  contains(., &quot;scheme='https'&quot;))]">
    <xsl:value-of select="." disable-output-escaping="yes" />
  </xsl:template>

  <xsl:template match="Service[not(Connector[@scheme = 'https'] or
                                   comment()[contains(., '&lt;Connector') and
                                             (contains(., 'scheme=&quot;https&quot;') or
                                              contains(., &quot;scheme='https'&quot;))]
                                  )]
                      ">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()" mode="insertConnector" />
    </xsl:copy>
  </xsl:template>

  <!-- Add the new connector after the last existing Connnector if there's one -->
  <xsl:template match="Connector[last()]" mode="insertConnector">
    <xsl:call-template name="Copy" />

    <xsl:call-template name="AddConnector" />
  </xsl:template>

  <!-- ... or before the first Engine if there's no existing Connector -->
  <xsl:template match="Engine[1][not(preceding-sibling::Connector)]"
                mode="insertConnector">
    <xsl:call-template name="AddConnector" />

    <xsl:call-template name="Copy" />
  </xsl:template>

  <xsl:template name="AddConnector">
    <!-- Add new line -->
    <xsl:text>&#xa;</xsl:text>
    <!-- This is the new connector -->
    <Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true" 
               maxThreads="150" scheme="https" secure="true" 
               keystoreFile="${{user.home}}/.keystore" keystorePass="changeit"
               clientAuth="false" sslProtocol="TLS" />
  </xsl:template>
  
</xsl:stylesheet>
```

#### Finalize configuration

Finally, place the driver JARs in the Tomcat classpath and restart your App Service.

1. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/site/lib* directory. In the [Cloud Shell](https://shell.azure.com), run `az webapp deploy --type=lib` for each driver JAR:

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path <jar-name>.jar --type=lib --path <jar-name>.jar
```

If you created a server-level data source, restart the App Service Linux application. Tomcat resets `CATALINA_BASE` to `/home/tomcat` and uses the updated configuration.

---

::: zone-end

::: zone pivot="java-jboss"

There are three core steps when [registering a data source with JBoss EAP](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/configuration_guide/datasource_management): uploading the JDBC driver, adding the JDBC driver as a module, and registering the module. App Service is a stateless hosting service, so the configuration commands for adding and registering the data source module must be scripted and applied as the container starts.

1. Obtain your database's JDBC driver.
2. Create an XML module definition file for the JDBC driver. The following example shows a module definition for PostgreSQL.

    ```xml
    <?xml version="1.0" ?>
    <module xmlns="urn:jboss:module:1.1" name="org.postgres">
        <resources>
        <!-- ***** IMPORTANT : REPLACE THIS PLACEHOLDER *******-->
        <resource-root path="/home/site/deployments/tools/postgresql-42.2.12.jar" />
        </resources>
        <dependencies>
            <module name="javax.api"/>
            <module name="javax.transaction.api"/>
        </dependencies>
    </module>
    ```

1. Put your JBoss CLI commands into a file named `jboss-cli-commands.cli`. The JBoss commands must add the module and register it as a data source. The following example shows the JBoss CLI commands for PostgreSQL.

    ```bash
    #!/usr/bin/env bash
    module add --name=org.postgres --resources=/home/site/deployments/tools/postgresql-42.2.12.jar --module-xml=/home/site/deployments/tools/postgres-module.xml

    /subsystem=datasources/jdbc-driver=postgres:add(driver-name="postgres",driver-module-name="org.postgres",driver-class-name=org.postgresql.Driver,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource)

    data-source add --name=postgresDS --driver-name=postgres --jndi-name=java:jboss/datasources/postgresDS --connection-url=${POSTGRES_CONNECTION_URL,env.POSTGRES_CONNECTION_URL:jdbc:postgresql://db:5432/postgres} --user-name=${POSTGRES_SERVER_ADMIN_FULL_NAME,env.POSTGRES_SERVER_ADMIN_FULL_NAME:postgres} --password=${POSTGRES_SERVER_ADMIN_PASSWORD,env.POSTGRES_SERVER_ADMIN_PASSWORD:example} --use-ccm=true --max-pool-size=5 --blocking-timeout-wait-millis=5000 --enabled=true --driver-class=org.postgresql.Driver --exception-sorter-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter --jta=true --use-java-context=true --valid-connection-checker-class-name=org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker
    ```

1. Create a startup script, `startup_script.sh` that calls the JBoss CLI commands. The following example shows how to call your `jboss-cli-commands.cli`. Later, you'll configure App Service to run this script when the container starts.

    ```bash
    $JBOSS_HOME/bin/jboss-cli.sh --connect --file=/home/site/deployments/tools/jboss-cli-commands.cli
    ```

1. Using an FTP client of your choice, upload your JDBC driver, `jboss-cli-commands.cli`, `startup_script.sh`, and the module definition to `/site/deployments/tools/`.
2. Configure your site to run `startup_script.sh` when the container starts. In the Azure portal, navigate to **Configuration** > **General Settings** > **Startup Command**. Set the startup command field to `/home/site/deployments/tools/startup_script.sh`. **Save** your changes.

To confirm that the datasource was added to the JBoss server, SSH into your webapp and run `$JBOSS_HOME/bin/jboss-cli.sh --connect`. Once you're connected to JBoss, run the `/subsystem=datasources:read-resource` to print a list of the data sources.

::: zone-end

## Next steps

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

- [App Service Linux FAQ](faq-app-service-linux.yml)
- [Environment variables and app settings reference](reference-app-settings.md)
