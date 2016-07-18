<properties
	pageTitle="Build an HBase application using Maven and Java, then deploy to Linux-based HDInsight | Microsoft Azure"
	description="Learn how to use Apache Maven to build a Java-based Apache HBase application, then deploy it to Linux-based HDInsight in the Azure cloud."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/29/2016"
	ms.author="larryfr"/>

#Use Maven to build Java applications that use HBase with Linux-based HDInsight (Hadoop)

Learn how to create and build an [Apache HBase](http://hbase.apache.org/) application in Java by using Apache Maven. Then use the application with a Linux-based HDInsight cluster.

[Maven](http://maven.apache.org/) is a software project management and comprehension tool that allows you to build software, documentation, and reports for Java projects. In this article, you will learn how to use it to create a basic Java application that that creates, queries, and deletes an HBase table on a Linux-based HDInsight cluster.

> [AZURE.NOTE] The steps in this document assume that you are using a Linux-based HDInsight cluster. For information on using a Windows-based HDInsight cluster, see [Use Maven to build Java applications that use HBase with Windows-based HDInsight](hdinsight-hbase-build-java-maven.md)

##Requirements

* [Java platform JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 7 or later

* [Maven](http://maven.apache.org/)

* [An Linux-based Azure HDInsight cluster with HBase](../hdinsight-hbase-get-started-linux.md#create-hbase-cluster)

    > [AZURE.NOTE] The steps in this document have been tested with HDInsight cluster versions 3.2, 3.3, and 3.4. The default values provided in examples are for a HDInsight 3.4 cluster.

* **Familiarity with SSH and SCP**. For more information on using SSH and SCP with HDInsight, see the following:

    * **Linux, Unix or OS X clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Linux, OS X or Unix](hdinsight-hadoop-linux-use-ssh-unix.md)

    * **Windows clients**: See [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

##Create the project

1. From the command-line in your development environment, change directories to the location where you want to create the project, for example, `cd code/hdinsight`.

2. Use the __mvn__ command, which is installed with Maven, to generate the scaffolding for the project.

		mvn archetype:generate -DgroupId=com.microsoft.examples -DartifactId=hbaseapp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

	This creates a new directory in the current directory, with the name specified by the __artifactID__ parameter (**hbaseapp** in this example.) This directory will contain the following items:

	* __pom.xml__:  The Project Object Model ([POM](http://maven.apache.org/guides/introduction/introduction-to-the-pom.html)) contains information and configuration details used to build the project.

	* __src__: The directory that contains the __main/java/com/microsoft/examples__ directory, where you will author the application.

3. Delete the __src/test/java/com/microsoft/examples/apptest.java__ file because it will not be used in this example.

##Update the Project Object Model

1. Edit the __pom.xml__ file and add the following code inside the `<dependencies>` section:

		<dependency>
      	  <groupId>org.apache.hbase</groupId>
          <artifactId>hbase-client</artifactId>
          <version>1.1.2</version>
        </dependency>

	This tells Maven that the project requires __hbase-client__ version __1.1.2__. At compile time, this will be downloaded from the default Maven repository. You can use the [Maven Central Repository Search](http://search.maven.org/#artifactdetails%7Corg.apache.hbase%7Chbase-client%7C0.98.4-hadoop2%7Cjar) to learn more about this dependency.

    > [AZURE.IMPORTANT] The version number must match the version of HBase that is provided with your HDInsight cluster. Use the following table to find the correct version number.

    | HDInsight cluster version | HBase version to use |
    | ----- | ----- |
    | 3.2 | 0.98.4-hadoop2 |
    | 3.3 and 3.4 | 1.1.2 |

    For more information on HDInsight versions and components, see [What are the different Hadoop components available with HDInsight](hdinsight-component-versioning.md).

2. If you are using an HDInsight 3.3 or 3.4 cluster, you must also add the following to the `<dependencies>` section:

        <dependency>
            <groupId>org.apache.phoenix</groupId>
            <artifactId>phoenix-core</artifactId>
            <version>4.4.0-HBase-1.1</version>
        </dependency>
    
    This will load the phoenix-core components, which are needed with Hbase version 1.1.x.

2. Add the following code to the __pom.xml__ file. This must be inside the `<project>...</project>` tags in the file, for example, between `</dependencies>` and `</project>`.

		<build>
		  <sourceDirectory>src</sourceDirectory>
		  <resources>
	        <resource>
	          <directory>${basedir}/conf</directory>
	          <filtering>false</filtering>
	          <includes>
	            <include>hbase-site.xml</include>
	          </includes>
	        </resource>
	      </resources>
		  <plugins>
		    <plugin>
        	  <groupId>org.apache.maven.plugins</groupId>
        	  <artifactId>maven-compiler-plugin</artifactId>
						<version>3.3</version>
        	  <configuration>
          	    <source>1.7</source>
          	    <target>1.7</target>
        	  </configuration>
      		</plugin>
		    <plugin>
		      <groupId>org.apache.maven.plugins</groupId>
		      <artifactId>maven-shade-plugin</artifactId>
		      <version>2.3</version>
		      <configuration>
		        <transformers>
		          <transformer implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer">
	              </transformer>
	            </transformers>
		      </configuration>
		      <executions>
		        <execution>
		          <phase>package</phase>
		          <goals>
		            <goal>shade</goal>
		          </goals>
		        </execution>
		      </executions>
		    </plugin>
		  </plugins>
		</build>

	This configures a resource (__conf/hbase-site.xml__,) that contains configuration information for HBase.

	> [AZURE.NOTE] You can also set configuration values via code. See the comments in the __CreateTable__ example that follows for how to do this.

	This also configures the [Maven Compiler Plugin](http://maven.apache.org/plugins/maven-compiler-plugin/) and [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/). The compiler plug-in is used to compile the topology. The shade plug-in is used to prevent license duplication in the JAR package that is built by Maven. The reason this is used is that the duplicate license files cause an error at run time on the HDInsight cluster. Using maven-shade-plugin with the `ApacheLicenseResourceTransformer` implementation prevents this error.

	The maven-shade-plugin also produces an uber jar (or fat jar,) that contains all the dependencies required by the application.

3. Save the __pom.xml__ file.

4. Create a new directory named __conf__ in the __hbaseapp__ directory. This will be used to hold configuration information for connecting to HBase.

5. Use the following command to copy the HBase configuration from the HDInsight server to the __conf__ directory. Replace **USERNAME** the the name of your SSH login. Replace **CLUSTERNAME** with your HDInsight cluster name:

		scp USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:/etc/hbase/conf/hbase-site.xml ./conf/hbase-site.xml

	> [AZURE.NOTE] If you used a password for your SSH account, you will be prompted to enter the password. If you used an SSH key with the account, you may need to use the `-i` parameter to specify the path to the key file. The following example will load the private key from `~/.ssh/id_rsa`:
	>
	> `scp -i ~/.ssh/id_rsa USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:/etc/hbase/conf/hbase-site.xml ./conf/hbase-site.xml`

##Create the application

1. Go to the __hbaseapp/src/main/java/com/microsoft/examples__ directory and rename the app.java file to __CreateTable.java__.

2. Open the __CreateTable.java__ file and replace the existing contents with the following:

        package com.microsoft.examples;
        import java.io.IOException;

        import org.apache.hadoop.conf.Configuration;
        import org.apache.hadoop.hbase.HBaseConfiguration;
        import org.apache.hadoop.hbase.client.HBaseAdmin;
        import org.apache.hadoop.hbase.HTableDescriptor;
        import org.apache.hadoop.hbase.TableName;
        import org.apache.hadoop.hbase.HColumnDescriptor;
        import org.apache.hadoop.hbase.client.HTable;
        import org.apache.hadoop.hbase.client.Put;
        import org.apache.hadoop.hbase.util.Bytes;

        public class CreateTable {
          public static void main(String[] args) throws IOException {
            Configuration config = HBaseConfiguration.create();

            // Example of setting zookeeper values for HDInsight
            // in code instead of an hbase-site.xml file
            //
            // config.set("hbase.zookeeper.quorum",
            //            "zookeepernode0,zookeepernode1,zookeepernode2");
            //config.set("hbase.zookeeper.property.clientPort", "2181");
            //config.set("hbase.cluster.distributed", "true");
            //
            //NOTE: Actual zookeeper host names can be found using Ambari:
            //curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/hosts"
            
            //Linux-based HDInsight clusters use /hbase-unsecure as the znode parent
            config.set("zookeeper.znode.parent","/hbase-unsecure");

            // create an admin object using the config
            HBaseAdmin admin = new HBaseAdmin(config);

            // create the table...
            HTableDescriptor tableDescriptor = new HTableDescriptor(TableName.valueOf("people"));
            // ... with two column families
            tableDescriptor.addFamily(new HColumnDescriptor("name"));
            tableDescriptor.addFamily(new HColumnDescriptor("contactinfo"));
            admin.createTable(tableDescriptor);

            // define some people
            String[][] people = {
                { "1", "Marcel", "Haddad", "marcel@fabrikam.com"},
                { "2", "Franklin", "Holtz", "franklin@contoso.com" },
                { "3", "Dwayne", "McKee", "dwayne@fabrikam.com" },
                { "4", "Rae", "Schroeder", "rae@contoso.com" },
                { "5", "Rosalie", "burton", "rosalie@fabrikam.com"},
                { "6", "Gabriela", "Ingram", "gabriela@contoso.com"} };

            HTable table = new HTable(config, "people");

            // Add each person to the table
            //   Use the `name` column family for the name
            //   Use the `contactinfo` column family for the email
            for (int i = 0; i< people.length; i++) {
              Put person = new Put(Bytes.toBytes(people[i][0]));
              person.add(Bytes.toBytes("name"), Bytes.toBytes("first"), Bytes.toBytes(people[i][1]));
              person.add(Bytes.toBytes("name"), Bytes.toBytes("last"), Bytes.toBytes(people[i][2]));
              person.add(Bytes.toBytes("contactinfo"), Bytes.toBytes("email"), Bytes.toBytes(people[i][3]));
              table.put(person);
            }
            // flush commits and close the table
            table.flushCommits();
            table.close();
          }
        }

	This is the __CreateTable__ class, which will create a table named __people__ and populate it with some predefined users.

3. Save the __CreateTable.java__ file.

4. In the __hbaseapp/src/main/java/com/microsoft/examples__ directory, create a new file named __SearchByEmail.java__. Use the following as the contents of this file:

		package com.microsoft.examples;
		import java.io.IOException;

		import org.apache.hadoop.conf.Configuration;
		import org.apache.hadoop.hbase.HBaseConfiguration;
		import org.apache.hadoop.hbase.client.HTable;
		import org.apache.hadoop.hbase.client.Scan;
		import org.apache.hadoop.hbase.client.ResultScanner;
		import org.apache.hadoop.hbase.client.Result;
		import org.apache.hadoop.hbase.filter.RegexStringComparator;
		import org.apache.hadoop.hbase.filter.SingleColumnValueFilter;
		import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp;
		import org.apache.hadoop.hbase.util.Bytes;
		import org.apache.hadoop.util.GenericOptionsParser;

		public class SearchByEmail {
		  public static void main(String[] args) throws IOException {
		    Configuration config = HBaseConfiguration.create();

		    // Use GenericOptionsParser to get only the parameters to the class
		    // and not all the parameters passed (when using WebHCat for example)
		    String[] otherArgs = new GenericOptionsParser(config, args).getRemainingArgs();
		    if (otherArgs.length != 1) {
		      System.out.println("usage: [regular expression]");
		      System.exit(-1);
		    }

			// Open the table
		    HTable table = new HTable(config, "people");

			// Define the family and qualifiers to be used
		    byte[] contactFamily = Bytes.toBytes("contactinfo");
		    byte[] emailQualifier = Bytes.toBytes("email");
		    byte[] nameFamily = Bytes.toBytes("name");
		    byte[] firstNameQualifier = Bytes.toBytes("first");
		    byte[] lastNameQualifier = Bytes.toBytes("last");

			// Create a new regex filter
		    RegexStringComparator emailFilter = new RegexStringComparator(otherArgs[0]);
			// Attach the regex filter to a filter
			//   for the email column
		    SingleColumnValueFilter filter = new SingleColumnValueFilter(
		      contactFamily,
		      emailQualifier,
		      CompareOp.EQUAL,
		      emailFilter
		    );

			// Create a scan and set the filter
		    Scan scan = new Scan();
		    scan.setFilter(filter);

			// Get the results
		    ResultScanner results = table.getScanner(scan);
			// Iterate over results and print  values
		    for (Result result : results ) {
		      String id = new String(result.getRow());
		      byte[] firstNameObj = result.getValue(nameFamily, firstNameQualifier);
		      String firstName = new String(firstNameObj);
		      byte[] lastNameObj = result.getValue(nameFamily, lastNameQualifier);
		      String lastName = new String(lastNameObj);
		      System.out.println(firstName + " " + lastName + " - ID: " + id);
			  byte[] emailObj = result.getValue(contactFamily, emailQualifier);
		      String email = new String(emailObj);
			  System.out.println(firstName + " " + lastName + " - " + email + " - ID: " + id);
		    }
		    results.close();
			table.close();
		  }
		}

	The __SearchByEmail__ class can be used to query for rows by email address. Because it uses a regular expression filter, you can provide either a string or a regular expression when using the class.

5. Save the __SearchByEmail.java__ file.

6. In the __hbaseapp/src/main/hava/com/microsoft/examples__ directory, create a new file named __DeleteTable.java__. Use the following as the contents of this file:

		package com.microsoft.examples;
		import java.io.IOException;

		import org.apache.hadoop.conf.Configuration;
		import org.apache.hadoop.hbase.HBaseConfiguration;
		import org.apache.hadoop.hbase.client.HBaseAdmin;

		public class DeleteTable {
		  public static void main(String[] args) throws IOException {
		    Configuration config = HBaseConfiguration.create();

		    // Create an admin object using the config
		    HBaseAdmin admin = new HBaseAdmin(config);

		    // Disable, and then delete the table
		    admin.disableTable("people");
		    admin.deleteTable("people");
		  }
		}

	This class is for cleaning up this example by disabling and dropping the table created by the __CreateTable__ class.

7. Save the __DeleteTable.java__ file.

##Build and package the application

2. From the __hbaseapp__ directory, use the following command to build a JAR file that contains the application:

		mvn clean package

	This cleans any previous build artifacts, downloads any dependencies that have not already been installed, then builds and packages the application.

3. When the command completes, the __hbaseapp/target__ directory will contain a file named __hbaseapp-1.0-SNAPSHOT.jar__.

	> [AZURE.NOTE] The __hbaseapp-1.0-SNAPSHOT.jar__ file is an uber jar (sometimes called a fat jar,) which contains all the dependencies required to run the application.

##Upload the JAR file and run jobs

1. Use the following to upload the jar to the HDInsight cluster. Replace **USERNAME** the the name of your SSH login. Replace **CLUSTERNAME** with your HDInsight cluster name:

		scp ./target/hbaseapp-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:.

	This will upload the file to the home directory for your SSH user account.

	> [AZURE.NOTE] If you used a password for your SSH account, you will be prompted to enter the password. If you used an SSH key with the account, you may need to use the `-i` parameter to specify the path to the key file. The following example will load the private key from `~/.ssh/id_rsa`:
	>
	> `scp -i ~/.ssh/id_rsa ./target/hbaseapp-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:.`

2. Use SSH to connect to the HDInsight cluster. Replace **USERNAME** the the name of your SSH login. Replace **CLUSTERNAME** with your HDInsight cluster name:

		ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net

	> [AZURE.NOTE] If you used a password for your SSH account, you will be prompted to enter the password. If you used an SSH key with the account, you may need to use the `-i` parameter to specify the path to the key file. The following example will load the private key from `~/.ssh/id_rsa`:
	>
	> `ssh -i ~/.ssh/id_rsa USERNAME@CLUSTERNAME-ssh.azurehdinsight.net`

3. Once connected, use the following to create a new HBase table using the Java application:

		hadoop jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.CreateTable

	This will create a new HBase table named __people__, and populate it with data.

4. Next, use the following to search for email addresses stored in the table:

		hadoop jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.SearchByEmail contoso.com

	You should receive the following results:

		Franklin Holtz - ID: 2
		Franklin Holtz - franklin@contoso.com - ID: 2
		Rae Schroeder - ID: 4
		Rae Schroeder - rae@contoso.com - ID: 4
		Gabriela Ingram - ID: 6
		Gabriela Ingram - gabriela@contoso.com - ID: 6

##Delete the table

When you are done with the example, use the following command from the Azure PowerShell session to delete the __people__ table used in this example:

	hadoop jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.DeleteTable

