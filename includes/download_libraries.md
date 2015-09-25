## Azure Client Libraries for Java - Manual Download

The Azure Libraries for Java are distributed under the [Apache License, Version 2.0][license]. Click [here][zip-download] for a ZIP file of the libraries and all dependencies.  This is made available by Microsoft Open Technologies, Inc.  See the license.txt and ThirdPartyNotices.txt file file inside the ZIP for license and other information.

## Azure Libraries for Java - Maven

If your project is already set up to use Maven for build, add the following dependency to your pom.xml file. Note: For information about creating Maven projects in Eclipse which use the Azure libraries for Java, see [http://go.microsoft.com/fwlink/?LinkId=622998]().

	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-management</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-management-compute</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-management-network</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-management-sql</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-management-storage</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-management-websites</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-media</artifactId>
	    <version>0.6.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-servicebus</artifactId>
	    <version>0.7.0</version>
	</dependency>
	<dependency>
	    <groupId>com.microsoft.azure</groupId>
	    <artifactId>azure-serviceruntime</artifactId>
	    <version>0.6.0</version>
	</dependency>


Within the `<version>` element, replace the version numbers in this example with valid version numbers, which can be obtained from the [Azure Libraries Repository on Maven](http://go.microsoft.com/fwlink/?LinkID=286274).

[license]: http://www.apache.org/licenses/LICENSE-2.0.html
[zip-download]:  http://go.microsoft.com/fwlink/?LinkId=253887
