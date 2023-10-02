---
title: "Quickstart: Your first Java query"
description: In this quickstart, you follow the steps to enable the Resource Graph Maven packages for Java and run your first query.
ms.date: 07/09/2021
ms.topic: quickstart
ms.custom: devx-track-java, devx-track-extended-java
---
# Quickstart: Run your first Resource Graph query using Java

The first step to using Azure Resource Graph is to check that the required Maven packages for Java
are installed. This quickstart walks you through the process of adding the Maven packages to your
Java installation.

At the end of this process, you'll have added the Maven packages to your Java installation and run
your first Resource Graph query.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a
  [free](https://azure.microsoft.com/free/) account before you begin.

- Check that the latest Azure CLI is installed (at least **2.21.0**). If it isn't yet installed, see
  [Install the Azure CLI](/cli/azure/install-azure-cli).

  > [!NOTE]
  > Azure CLI is required to enable Azure SDK for Java to use the **CLI-based authentication** in
  > the following examples. For information about other options, see
  > [Azure Identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity).

- The [Java Developer Kit](/azure/developer/java/fundamentals/java-support-on-azure), version
  8.

- [Apache Maven](https://maven.apache.org/), version 3.6 or above.

## Create the Resource Graph project

To enable Java to query Azure Resource Graph, create and configure a new application with Maven and
install the required Maven packages.

1. Initialize a new Java application named "argQuery" with a
   [Maven archetype](https://maven.apache.org/guides/introduction/introduction-to-archetypes.html):

   ```cmd
   mvn -B archetype:generate -DarchetypeGroupId="org.apache.maven.archetypes" -DgroupId="com.Fabrikam" -DartifactId="argQuery"
   ```

1. Change directories into the new project folder `argQuery` and open `pom.xml` in your favorite
   editor. Add the following `<dependency>` nodes under the existing `<dependencies>` node:

   ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.2.4</version>
    </dependency>
    <dependency>
        <groupId>com.azure.resourcemanager</groupId>
        <artifactId>azure-resourcemanager-resourcegraph</artifactId>
        <version>1.0.0</version>
    </dependency>
   ```

1. In the `pom.xml` file, add the following `<properties>` node under the base `<project>` node to
   update the source and target versions:

   ```xml
   <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

1. In the `pom.xml` file, add the following `<build>` node under the base `<project>` node to
   configure the goal and main class for the project to run.

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>org.codehaus.mojo</groupId>
               <artifactId>exec-maven-plugin</artifactId>
               <version>1.2.1</version>
               <executions>
                   <execution>
                       <goals>
                           <goal>java</goal>
                       </goals>
                   </execution>
               </executions>
               <configuration>
                   <mainClass>com.Fabrikam.App</mainClass>
               </configuration>
           </plugin>
       </plugins>
   </build>
   ```

1. Replace the default `App.java` in `\argQuery\src\main\java\com\Fabrikam` with the following code
   and save the updated file:

   ```java
   package com.Fabrikam;

   import java.util.Arrays;
   import java.util.List;
   import com.azure.core.management.AzureEnvironment;
   import com.azure.core.management.profile.AzureProfile;
   import com.azure.identity.DefaultAzureCredentialBuilder;
   import com.azure.resourcemanager.resourcegraph.ResourceGraphManager;
   import com.azure.resourcemanager.resourcegraph.models.QueryRequest;
   import com.azure.resourcemanager.resourcegraph.models.QueryRequestOptions;
   import com.azure.resourcemanager.resourcegraph.models.QueryResponse;
   import com.azure.resourcemanager.resourcegraph.models.ResultFormat;

   public class App
   {
       public static void main( String[] args )
       {
           List<String> listSubscriptionIds = Arrays.asList(args[0]);
           String strQuery = args[1];

           ResourceGraphManager manager = ResourceGraphManager.authenticate(new DefaultAzureCredentialBuilder().build(), new AzureProfile(AzureEnvironment.AZURE));

           QueryRequest queryRequest = new QueryRequest()
               .withSubscriptions(listSubscriptionIds)
               .withQuery(strQuery);

           QueryResponse response = manager.resourceProviders().resources(queryRequest);

           System.out.println("Records: " + response.totalRecords());
           System.out.println("Data:\n" + response.data());
       }
   }
   ```

1. Build the `argQuery` console application:

   ```bash
   mvn package
   ```

## Run your first Resource Graph query

With the Java console application built, it's time to try out a simple Resource Graph query. The
query returns the first five Azure resources with the **Name** and **Resource Type** of each
resource.

In each call to `argQuery`, there are variables that are used that you need to replace with your own
values:

- `{subscriptionId}` - Replace with your subscription ID
- `{query}` - Replace with your Azure Resource Graph query

1. Use the Azure CLI to authenticate with `az login`.

1. Change directories to the `argQuery` project folder you created with the previous
   `mvn -B archetype:generate` command.

1. Run your first Azure Resource Graph query using Maven to compile the console application and pass
   the arguments. The `exec.args` property identifies arguments by spaces. To identify the query as
   a single argument, we wrap it with single quotes (`'`).

   ```bash
   mvn compile exec:java -Dexec.args "{subscriptionId} 'Resources | project name, type | limit 5'"
   ```

   > [!NOTE]
   > As this query example doesn't provide a sort modifier such as `order by`, running this query
   > multiple times is likely to yield a different set of resources per request.

1. Change the argument to `argQuery.exe` and change the query to `order by` the **Name** property:

   ```bash
   mvn compile exec:java -Dexec.args "{subscriptionId} 'Resources | project name, type | limit 5 | order by name asc'"
   ```

   > [!NOTE]
   > Just as with the first query, running this query multiple times is likely to yield a different
   > set of resources per request. The order of the query commands is important. In this example,
   > the `order by` comes after the `limit`. This command order first limits the query results and
   > then orders them.

1. Change the final parameter to `argQuery.exe` and change the query to first `order by` the
   **Name** property and then `limit` to the top five results:

   ```bash
   mvn compile exec:java -Dexec.args "{subscriptionId} 'Resources | project name, type | order by name asc | limit 5'"
   ```

When the final query is run several times, assuming that nothing in your environment is changing,
the results returned are consistent and ordered by the **Name** property, but still limited to the
top five results.

## Clean up resources

If you wish to remove the Java console application and installed packages, you can do so by deleting
the `argQuery` project folder.

## Next steps

In this quickstart, you've created a Java console application with the required Resource Graph
packages and run your first query. To learn more about the Resource Graph language, continue to the
query language details page.

> [!div class="nextstepaction"]
> [Get more information about the query language](./concepts/query-language.md)
