---
title: Configure Data Sources for Tomcat, JBoss, or Java SE Apps
description: Learn how to configure data sources for Tomcat, JBoss, or Java SE apps on Azure App Service, including native Windows and Linux container variants.
keywords: azure app service, web app, windows, oss, java, tomcat, jboss
ms.devlang: java
ms.topic: how-to 
ms.date: 04/02/2026
zone_pivot_groups: app-service-java-hosting
adobe-target: true
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.custom:
  - devx-track-java
  - devx-track-azurecli
  - devx-track-extended-java
  - linux-related-content
  - sfi-ropc-nochange
 
# customer intent: As a developer, I want to configure a data source for a Tomcat, JBoss, or Java SE app.
 
---

# Configure data sources for a Tomcat, JBoss, or Java SE app in Azure App Service

This article shows how to configure data sources in a Java SE, Tomcat, or JBoss app in App Service.

[!INCLUDE [java-variants](includes/configure-language-java/java-variants.md)]

## Configure the data source

::: zone pivot="java-javase"

To connect to data sources in Spring Boot applications, we suggest creating connection strings and injecting them into your *application.properties* file.

1. In the left pane of the App Service page, select **Settings** > **Environment variables**. On the **Connection strings** tab, select **Add**. Set a **Name** for the string, paste your JDBC connection string into the **Value** field, and set the **Type** to **Custom**. You can optionally set the connection string as a slot setting.

    The connection string is accessible to your application as an environment variable named `CUSTOMCONNSTR_<your-string-name>`. For example, `CUSTOMCONNSTR_exampledb`.

1. In your *application.properties* file, reference the connection string with the environment variable name. For the preceding example, you would use this code:

    ```yml
    app.datasource.url=${CUSTOMCONNSTR_exampledb}
    ```

For more information, see the [Spring Boot documentation on data access](https://docs.spring.io/spring-boot/how-to/data-access.html) and [externalized configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html).

::: zone-end

::: zone pivot="java-tomcat"

> [!TIP]
> Linux Tomcat containers can automatically configure shared data sources in the Tomcat server if you set the environment variable `WEBSITE_AUTOCONFIGURE_DATABASE` to `true`. The only thing for you to do is add an app setting that contains a valid JDBC connection string to an Oracle, SQL Server, PostgreSQL, or MySQL database (including the connection credentials). App Service automatically adds the corresponding shared database to */usr/local/tomcat/conf/context.xml*, using an appropriate driver that's available in the container. For an end-to-end scenario that uses this approach, see [Tutorial: Build a Tomcat web app with Azure App Service on Linux and MySQL](tutorial-java-tomcat-mysql-app.md).

These instructions apply to all database connections. You need to replace placeholders with your chosen database's driver class name and JAR file. The following table provides class names and driver downloads for common databases.

| Database   | Driver class name                             | JDBC driver                                                                      |
|------------|-----------------------------------------------|------------------------------------------------------------------------------------------|
| PostgreSQL | `org.postgresql.Driver`                        | [Download](https://jdbc.postgresql.org/download/)                                    |
| MySQL      | `com.mysql.jdbc.Driver`                        | [Download](https://dev.mysql.com/downloads/connector/j/) (Select **Platform Independent**.) |
| SQL Server | `com.microsoft.sqlserver.jdbc.SQLServerDriver` | [Download](/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server#download)                                                           |

To configure Tomcat to use Java Database Connectivity (JDBC) or the Java Persistence API (JPA), first customize the `CATALINA_OPTS` environment variable that's read in by Tomcat at startup. Set this value by using an app setting in the [App Service Maven plugin](https://github.com/Microsoft/azure-maven-plugins/blob/develop/azure-webapp-maven-plugin/README.md):

```xml
<appSettings>
    <property>
        <name>CATALINA_OPTS</name>
        <value>"$CATALINA_OPTS -Ddbuser=${DBUSER} -Ddbpassword=${DBPASSWORD} -DconnURL=${CONNURL}"</value>
    </property>
</appSettings>
```

Or set the environment variable on the **App settings** tab of the **Settings** > **Environment variables** page in the Azure portal.

Next, determine whether the data source should be available to one application or to all applications running on the Tomcat servlet.

### Application-level data sources

To configure an application-level data source:

1. Create a *context.xml* file in the *META-INF/* directory of your project. Create the *META-INF/* directory if it doesn't exist.

1. In *context.xml*, add a `Context` element to link the data source to a JNDI address. Replace the `driverClassName` placeholder with your driver's class name from the table that appears earlier in this article.

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

1. Update your application's *web.xml* to use the data source in your application.

    ```xml
    <resource-env-ref>
        <resource-env-ref-name>jdbc/dbconnection</resource-env-ref-name>
        <resource-env-ref-type>javax.sql.DataSource</resource-env-ref-type>
    </resource-env-ref>
    ```

### Shared server-level resources

# [Linux](#tab/linux)

> [!TIP]
> Linux Tomcat containers can automatically apply XSLT files by using the following convention for files copied to `/home/site/wwwroot`: If `server.xml.xsl` or `server.xml.xslt` is present, the files are applied to Tomcat's `server.xml`. If `context.xml.xsl` or `context.xml.xslt` is present, the files are applied to Tomcat's `context.xml`.

Adding a shared, server-level data source requires you to edit Tomcat's `server.xml`. Because file changes outside of the `/home` directory are ephemeral, changes to Tomcat's configuration files need to be applied programatically, as follows:

- Upload a [startup script](./faq-app-service-linux.yml) and set the path to the script in **Settings** > **Configuration**. On the **Stack settings** tab, add the path in the **Startup command** box. You can upload the startup script by using [FTP](deploy-ftp.md).

Your startup script makes an [XSL transform](https://www.w3schools.com/xml/xsl_intro.asp) to the `server.xml` file and outputs the resulting XML file to `/usr/local/tomcat/conf/server.xml`. The startup script should install `libxslt` or `xlstproc`, depending on the [distribution of the version of Tomcat](/azure/app-service/language-support-policy?tabs=linux#java-specific-runtime-statement-of-support) of your web app, as noted in the comment in the following example script. You can use FTP to upload your XSL file and startup script. 

```sh
# Install the libxslt package on Alpine-based images:
apk add --update libxslt

# Install the xsltproc package on Debian or Ubuntu-based images:
apt install xsltproc

# Also copy the transform file to /home/tomcat/conf/
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

  <!-- Add the new connector after the last existing connector if there is one -->
  <xsl:template match="Connector[last()]" mode="insertConnector">
    <xsl:call-template name="Copy" />

    <xsl:call-template name="AddConnector" />
  </xsl:template>

  <!-- ... or before the first engine if there's no existing connector -->
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

Finally, place the driver JARs in the Tomcat classpath and restart your App Service app.

- Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/site/lib* directory. In the [Cloud Shell](https://shell.azure.com), run `az webapp deploy --type=lib` for each driver JAR:

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path <jar-name>.jar --type=lib --path <jar-name>.jar
```

If you created a server-level data source, restart the App Service Linux application. Tomcat resets `CATALINA_BASE` to `/home/tomcat` and uses the updated configuration.

# [Windows](#tab/windows)

You can't directly modify a Tomcat installation for server-wide configuration because the installation location is read-only. The easiest way to make server-level configuration changes to your Windows Tomcat installation is to complete the following steps on app start: 

1. Copy Tomcat to a local directory (`%LOCAL_EXPANDED%`) and use that copy as `CATALINA_BASE`. (See the [Tomcat documentation on this variable](https://tomcat.apache.org/tomcat-10.1-doc/introduction.html)).
1. Add your shared data sources to `%LOCAL_EXPANDED%\tomcat\conf\server.xml` by using XSL transform.

#### Add a startup file

Create a file named `startup.cmd` in the `%HOME%\site\wwwroot` directory. This file runs automatically before the Tomcat server starts. The file should contain this:

```dos
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -File  %HOME%\site\configure.ps1 > %HOME%\site\configure.log
```

#### Add the PowerShell configuration script

Next, add a configuration script called `configure.ps1` to the `%HOME%\site` directory. The script contains this code:

```powershell
# Locations of XML and XSL files
$source_xml = "$Env:AZURE_TOMCAT90_HOME\conf\server.xml"
$target_xml = "$Env:LOCAL_EXPANDED\tomcat\conf\server.xml"
$target_xsl = "$Env:HOME\site\server.xsl"
$marker_file = "$Env:HOME\site\config_done_marker"

# Define the transform function
# Useful if transforming multiple files
function TransformXML {
    param ($xml, $xsl, $output)

    if (-not $xml -or -not $xsl -or -not $output) {
        return 0
    }

    Try {
        $xslt_settings = New-Object System.Xml.Xsl.XsltSettings;
        $XmlUrlResolver = New-Object System.Xml.XmlUrlResolver;
        $xslt_settings.EnableScript = 1;

        $xslt = New-Object System.Xml.Xsl.XslCompiledTransform;
        $xslt.Load($xsl, $xslt_settings, $XmlUrlResolver);
        $xslt.Transform($xml, $output);
    }

    Catch {
        $ErrorMessage = $_.Exception.Message
        $FailedItem = $_.Exception.ItemName
        Write-Error 'Error'$ErrorMessage':'$FailedItem':' $_.Exception;
        return 0
    }
    return 1
}

# Start here

# Check for marker file indicating that configuration has already been done
if (Test-Path "$marker_file") {
    return 0
}

# Delete previous Tomcat directory if it exists
# In case previous configuration isn't completed or a new configuration should be forcefully installed
if (Test-Path "$Env:LOCAL_EXPANDED\tomcat") {
    Remove-Item -Path "$Env:LOCAL_EXPANDED\tomcat" -Recurse -Force
}

# Copy Tomcat to local
# When you use the environment variable $AZURE_TOMCAT90_HOME, the 'default' version of Tomcat is used
New-Item "$Env:LOCAL_EXPANDED\tomcat" -ItemType Directory
Copy-Item -Path "$Env:AZURE_TOMCAT90_HOME\*" "$Env:LOCAL_EXPANDED\tomcat" -Recurse

# Perform the required customization of Tomcat
$success = TransformXML -xml $source_xml -xsl $target_xsl -output $target_xml

# Mark that the operation succeeded if it did
if ($success) {
    New-Item -Path "$marker_file" -ItemType File
}
```

This PowerShell completes the following steps:

1. Check whether a custom Tomcat copy exists. If one exists, the startup script can stop.
1. Copy Tomcat locally.
1. Add shared data sources to the custom Tomcat's configuration by using XSL transform.
1. Indicate that configuration completed successfully.

#### Add XSL transform file

A common use case for customizing the built-in Tomcat installation is to modify the `server.xml`, `context.xml`, or `web.xml` Tomcat configuration files. App Service already modifies these files to provide platform features. To continue to use these features, you need to preserve the content of these files when you make changes to them. To preserve this content, use an [XSL transformation (XSLT)](https://www.w3schools.com/xml/xsl_intro.asp).

Add an XSL transform file called *server.xsl* to the *%HOME%_\site* directory. You can use the following XSL transform code to add a new connector node to `server.xml`. The *identity transform* at the beginning  preserves the original contents of the configuration file.

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
  
    <!-- Identity transform: this transform ensures that the original contents of the file are included in the new file -->
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
  
    <!-- Add the new connector after the last existing connector if there is one -->
    <xsl:template match="Connector[last()]" mode="insertConnector">
      <xsl:call-template name="Copy" />
  
      <xsl:call-template name="AddConnector" />
    </xsl:template>
  
    <!-- ... or before the first engine if there's no existing connector -->
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

#### Set the `CATALINA_BASE` app setting

The platform also needs to know where your custom version of Tomcat is installed. You can set the installation's location in the `CATALINA_BASE` app setting.

You can use the Azure CLI to change this setting:

```azurecli
    az webapp config appsettings set -g $MyResourceGroup -n $MyUniqueApp --settings CATALINA_BASE="%LOCAL_EXPANDED%\tomcat"
```

Alternatively, you can manually change the setting in the Azure portal:

1. Go to **Settings** > **Environmental variables** > **App settings**.
1. Select **Add**.
1. Use these values to create the setting:
   1. **Name**: `CATALINA_BASE`
   1. **Value**: `"%LOCAL_EXPANDED%\tomcat"`

#### Finalize configuration

Finally, you place the driver JARs in the Tomcat classpath and restart your App Service. Ensure that the JDBC driver files are available to the Tomcat classloader by placing them in the */home/site/lib* directory. In the [Cloud Shell](https://shell.azure.com), run `az webapp deploy --type=lib` for each driver JAR:

```azurecli-interactive
az webapp deploy --resource-group <group-name> --name <app-name> --src-path <jar-name>.jar --type=lib --target-path <jar-name>.jar
```

---

::: zone-end

::: zone pivot="java-jboss"

> [!TIP]
> By default, Linux JBoss containers can automatically configure shared data sources in the JBoss server. The only thing you need to do is add an app setting that contains a valid JDBC connection string to an Oracle, SQL Server, PostgreSQL, or MySQL database (including the connection credentials), and add the app setting / environment variable `WEBSITE_AUTOCONFIGURE_DATABASE` with the value `true`. JDBC connections created with service connector are also supported. App Service automatically adds the corresponding shared data source (based on the app setting name and the suffix `_DS`), using an appropriate driver available in the container. For an end-to-end scenario that uses this approach, see [Tutorial: Build a JBoss web app with Azure App Service on Linux and MySQL](tutorial-java-jboss-mysql-app.md).

There are three main steps to [register a data source with JBoss EAP](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/configuration_guide/datasource_management): 

1. Upload the JDBC driver.
1. Add the JDBC driver as a module.
1. Add a data source with the module. 

App Service is a stateless hosting service, so you need to put these steps into a startup script and run it each time the JBoss container starts. Here are PostgreSQL, MySQL, and Azure SQL Database examples:

# [PostgreSQL](#tab/postgresql)

[!INCLUDE [configure-jboss-postgresql](includes/configure-language-java-data-sources/configure-jboss-postgresql.md)]

# [MySQL](#tab/mysql)

[!INCLUDE [configure-jboss-mysql](includes/configure-language-java-data-sources/configure-jboss-mysql.md)]

# [SQL Database](#tab/sqldatabase)

[!INCLUDE [configure-jboss-sqldatabase](includes/configure-language-java-data-sources/configure-jboss-sql-database.md)]

---

::: zone-end

## Related content

- [Azure for Java developer documentation](/java/azure/) 
- [App Service Linux FAQ](faq-app-service-linux.yml)
- [Environment variables and app settings reference](reference-app-settings.md)
