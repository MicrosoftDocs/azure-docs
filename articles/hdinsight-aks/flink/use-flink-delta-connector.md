---
title: How to use Apache Flink & Delta connector in HDInsight on AKS
description: Learn how to use Apache Flink-Delta connector
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# How to use Apache Flink-Delta connector

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

By using Apache Flink and Delta Lake together, you can create a reliable and scalable data lakehouse architecture. The Flink/Delta Connector allows you to write data to Delta tables with ACID transactions and exactly once processing. It means that your data streams are consistent and error-free, even if you restart your Flink pipeline from a checkpoint. The Flink/Delta Connector ensures that your data isn't lost or duplicated, and that it matches the Flink semantics.

In this article, you learn how to use Flink-Delta connector

> [!div class="checklist"]
> * Read the data from the delta table.
> * Write the data to a delta table.
> * Query it in Power BI.

## What is Apache Flink-Delta connector

Flink-Delta Connector is a JVM library to read and write data from Apache Flink applications to Delta tables utilizing the Delta Standalone JVM library. The connector provides exactly once delivery guarantee.

## Apache Flink-Delta Connector includes

* DeltaSink for writing data from Apache Flink to a Delta table.
* DeltaSource for reading Delta tables using Apache Flink.

We are using the following connector, to match with the HDInsight on AKS Flink version.

|Connector's version| Flink's version|
|-|-|
|0.6.0 |X >= 1.15.3|

## Prerequisites

* [HDInsight on AKS Flink 1.16.0](./flink-create-cluster-portal.md) 
* storage account
* [Power BI desktop](https://www.microsoft.com/download/details.aspx?id=58494)

## Read data from delta table

There are two types of delta sources, when it comes to reading data from delta table.

* Bounded: Batch processing
* Continuous: Streaming processing

In this example, we're using a bounded state of delta source.

**Sample xml file**

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>org.example.flink.delta</groupId>
	<artifactId>flink-delta</artifactId>
	<version>1.0-SNAPSHOT</version>
	<packaging>jar</packaging>

	<name>Flink Quickstart Job</name>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<flink.version>1.16.0</flink.version>
		<target.java.version>1.8</target.java.version>
		<scala.binary.version>2.12</scala.binary.version>
		<maven.compiler.source>${target.java.version}</maven.compiler.source>
		<maven.compiler.target>${target.java.version}</maven.compiler.target>
		<log4j.version>2.17.1</log4j.version>
	</properties>

	<repositories>
		<repository>
			<id>apache.snapshots</id>
			<name>Apache Development Snapshot Repository</name>
			<url>https://repository.apache.org/content/repositories/snapshots/</url>
			<releases>
				<enabled>false</enabled>
			</releases>
			<snapshots>
				<enabled>true</enabled>
			</snapshots>
		</repository>
<!--		<repository>-->
<!--			<id>delta-standalone_2.12</id>-->
<!--			<url>file://C:\Users\varastogi\Workspace\flink-main\flink-k8s-operator\target</url>-->
<!--		</repository>-->
	</repositories>

	<dependencies>
		<!-- Apache Flink dependencies -->
		<!-- These dependencies are provided, because they should not be packaged into the JAR file. -->
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-streaming-java</artifactId>
			<version>${flink.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-clients</artifactId>
			<version>${flink.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-java</artifactId>
			<version>${flink.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-connector-base</artifactId>
			<version>${flink.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-connector-files</artifactId>
			<version>${flink.version}</version>
		</dependency>
<!--		<dependency>-->
<!--			<groupId>io.delta</groupId>-->
<!--			<artifactId>delta-standalone_2.12</artifactId>-->
<!--			<version>4.0.0</version>-->
<!--			<scope>system</scope>-->
<!--			<systemPath>C:\Users\varastogi\Workspace\flink-main\flink-k8s-operator\target\io\delta\delta-standalone_2.12\4.0.0\delta-standalone_2.12-4.0.0.jar</systemPath>-->
<!--		</dependency>-->
		<dependency>
			<groupId>io.delta</groupId>
			<artifactId>delta-standalone_2.12</artifactId>
			<version>0.6.0</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-mapreduce-client-core</artifactId>
			<version>3.2.1</version>
		</dependency>
		<dependency>
			<groupId>io.delta</groupId>
			<artifactId>delta-flink</artifactId>
			<version>0.6.0</version>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-parquet</artifactId>
			<version>${flink.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-clients</artifactId>
			<version>${flink.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.parquet</groupId>
			<artifactId>parquet-common</artifactId>
			<version>1.12.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.parquet</groupId>
			<artifactId>parquet-column</artifactId>
			<version>1.12.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.parquet</groupId>
			<artifactId>parquet-hadoop</artifactId>
			<version>1.12.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-azure</artifactId>
			<version>3.3.2</version>
		</dependency>
<!--		<dependency>-->
<!--			<groupId>org.apache.hadoop</groupId>-->
<!--			<artifactId>hadoop-azure</artifactId>-->
<!--			<version>3.3.4</version>-->
<!--		</dependency>-->
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-mapreduce-client-core</artifactId>
			<version>3.2.1</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-client</artifactId>
			<version>3.3.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-table-common</artifactId>
			<version>${flink.version}</version>
<!--			<scope>provided</scope>-->
		</dependency>
		<dependency>
			<groupId>org.apache.parquet</groupId>
			<artifactId>parquet-hadoop-bundle</artifactId>
			<version>1.10.0</version>
		</dependency>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-table-runtime</artifactId>
			<version>${flink.version}</version>
			<scope>provided</scope>
		</dependency>
<!--		<dependency>-->
<!--			<groupId>org.apache.flink</groupId>-->
<!--			<artifactId>flink-table-common</artifactId>-->
<!--			<version>${flink.version}</version>-->
<!--		</dependency>-->
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-common</artifactId>
			<version>3.3.2</version>
		</dependency>

		<!-- Add connector dependencies here. They must be in the default scope (compile). -->

		<!-- Example:

		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-connector-kafka</artifactId>
			<version>${flink.version}</version>
		</dependency>
		-->

		<!-- Add logging framework, to produce console output when running in the IDE. -->
		<!-- These dependencies are excluded from the application JAR by default. -->
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-slf4j-impl</artifactId>
			<version>${log4j.version}</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-api</artifactId>
			<version>${log4j.version}</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-core</artifactId>
			<version>${log4j.version}</version>
			<scope>runtime</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>

			<!-- Java Compiler -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.1</version>
				<configuration>
					<source>${target.java.version}</source>
					<target>${target.java.version}</target>
				</configuration>
			</plugin>

			<!-- We use the maven-shade plugin to create a fat jar that contains all necessary dependencies. -->
			<!-- Change the value of <mainClass>...</mainClass> if your program entry point changes. -->
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-shade-plugin</artifactId>
				<version>3.1.1</version>
				<executions>
					<!-- Run shade goal on package phase -->
					<execution>
						<phase>package</phase>
						<goals>
							<goal>shade</goal>
						</goals>
						<configuration>
							<createDependencyReducedPom>false</createDependencyReducedPom>
							<artifactSet>
								<excludes>
									<exclude>org.apache.flink:flink-shaded-force-shading</exclude>
									<exclude>com.google.code.findbugs:jsr305</exclude>
									<exclude>org.slf4j:*</exclude>
									<exclude>org.apache.logging.log4j:*</exclude>
								</excludes>
							</artifactSet>
							<filters>
								<filter>
									<!-- Do not copy the signatures in the META-INF folder.
									Otherwise, this might cause SecurityExceptions when using the JAR. -->
									<artifact>*:*</artifact>
									<excludes>
										<exclude>META-INF/*.SF</exclude>
										<exclude>META-INF/*.DSA</exclude>
										<exclude>META-INF/*.RSA</exclude>
									</excludes>
								</filter>
							</filters>
							<transformers>
								<transformer implementation="org.apache.maven.plugins.shade.resource.ServicesResourceTransformer"/>
								<transformer implementation="org.apache.maven.plugins.shade.resource.ServicesResourceTransformer"/>
								<transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
									<mainClass>org.example.flink.delta.DataStreamJob</mainClass>
								</transformer>
							</transformers>
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>

		<pluginManagement>
			<plugins>

				<!-- This improves the out-of-the-box experience in Eclipse by resolving some warnings. -->
				<plugin>
					<groupId>org.eclipse.m2e</groupId>
					<artifactId>lifecycle-mapping</artifactId>
					<version>1.0.0</version>
					<configuration>
						<lifecycleMappingMetadata>
							<pluginExecutions>
								<pluginExecution>
									<pluginExecutionFilter>
										<groupId>org.apache.maven.plugins</groupId>
										<artifactId>maven-shade-plugin</artifactId>
										<versionRange>[3.1.1,)</versionRange>
										<goals>
											<goal>shade</goal>
										</goals>
									</pluginExecutionFilter>
									<action>
										<ignore/>
									</action>
								</pluginExecution>
								<pluginExecution>
									<pluginExecutionFilter>
										<groupId>org.apache.maven.plugins</groupId>
										<artifactId>maven-compiler-plugin</artifactId>
										<versionRange>[3.1,)</versionRange>
										<goals>
											<goal>testCompile</goal>
											<goal>compile</goal>
										</goals>
									</pluginExecutionFilter>
									<action>
										<ignore/>
									</action>
								</pluginExecution>
							</pluginExecutions>
						</lifecycleMappingMetadata>
					</configuration>
				</plugin>
			</plugins>
		</pluginManagement>
	</build>
</project>
```
* You're required to build the jar with required libraries and dependencies.
* Specify the ADLS Gen2 location in our java class to reference the source data.

:::image type="content" source="./media/use-flink-delta-connector/specify-the-adls-gen-2.png" alt-text="Screenshot showing how to specify the ADLS Gen2." lightbox="./media/use-flink-delta-connector/specify-the-adls-gen-2.png":::
   
   ```java
       public StreamExecutionEnvironment createPipeline(
            String tablePath,
            int sourceParallelism,
            int sinkParallelism) {

        DeltaSource<RowData> deltaSink = getDeltaSource(tablePath);
        StreamExecutionEnvironment env = getStreamExecutionEnvironment();

        env
            .fromSource(deltaSink, WatermarkStrategy.noWatermarks(), "bounded-delta-source")
            .setParallelism(sourceParallelism)
            .addSink(new ConsoleSink(Utils.FULL_SCHEMA_ROW_TYPE))
            .setParallelism(1);

        return env;
    }

    /**
     * An example of Flink Delta Source configuration that will read all columns from Delta table
     * using the latest snapshot.
     */
    @Override
    public DeltaSource<RowData> getDeltaSource(String tablePath) {
        return DeltaSource.forBoundedRowData(
            new Path(tablePath),
            new Configuration()
        ).build();
    }
   ```

1. Call the read class while submitting the job using [Flink CLI](./flink-web-ssh-on-portal-to-flink-sql.md).

   :::image type="content" source="./media/use-flink-delta-connector/call-the-read-class.png" alt-text="Screenshot shows how to call the read class file." lightbox="./media/use-flink-delta-connector/call-the-read-class.png":::

1. After submitting the job,  
    1. Check the status and metrics on Flink UI.
    1. Check the job manager logs for more details.

    :::image type="content" source="./media/use-flink-delta-connector/check-job-manager-logs.png" alt-text="Screenshot shows job manager logs." lightbox="./media/use-flink-delta-connector/check-job-manager-logs.png":::

## Writing to Delta sink

The delta sink is used for writing the data to a delta table in ADLS gen2. The data stream consumed by the delta sink.
1. Build the jar with required libraries and dependencies.
1. Enable checkpoint for delta logs to commit the history.

   :::image type="content" source="./media/use-flink-delta-connector/enable-checkpoint-for-delta-logs.png" alt-text="Screenshot shows how enable checkpoint for delta logs." lightbox="./media/use-flink-delta-connector/enable-checkpoint-for-delta-logs.png":::
   
   ```java
       public StreamExecutionEnvironment createPipeline(
            String tablePath,
            int sourceParallelism,
            int sinkParallelism) {

        DeltaSink<RowData> deltaSink = getDeltaSink(tablePath);
        StreamExecutionEnvironment env = getStreamExecutionEnvironment();

        // Using Flink Delta Sink in processing pipeline
        env
            .addSource(new DeltaExampleSourceFunction())
            .setParallelism(sourceParallelism)
            .sinkTo(deltaSink)
            .name("MyDeltaSink")
            .setParallelism(sinkParallelism);

        return env;
    }

    /**
     * An example of Flink Delta Sink configuration.
     */
    @Override
    public DeltaSink<RowData> getDeltaSink(String tablePath) {
        return DeltaSink
            .forRowData(
                new Path(TABLE_PATH),
                new Configuration(),
                Utils.FULL_SCHEMA_ROW_TYPE)
            .build();
    }
   ```
1. Call the delta sink class while submitting the job via Flink CLI. 
1. Specify the account key of the storage account in `flink-client-config` using [Flink configuration management](./flink-configuration-management.md). You can specify the account key of the storage account in Flink config. `fs.azure.<storagename>.dfs.core.windows.net : <KEY >`

   :::image type="content" source="./media/use-flink-delta-connector/call-the-delta-sink-class.png" alt-text="Screenshot shows how to call the delta sink class." lightbox="./media/use-flink-delta-connector/call-the-delta-sink-class.png":::

1. Specify the path of ADLS Gen2 storage account while specifying the delta sink properties.
1. Once the job is submitted, check the status and metrics on Flink UI.

    :::image type="content" source="./media/use-flink-delta-connector/check-the-status-on-flink-ui.png" alt-text="Screenshot shows status on Flink UI." lightbox="./media/use-flink-delta-connector/check-the-status-on-flink-ui.png":::

    :::image type="content" source="./media/use-flink-delta-connector/view-the-checkpoints-on-flink-ui.png" alt-text="Screenshot shows the checkpoints on Flink-UI." lightbox="./media/use-flink-delta-connector/view-the-checkpoints-on-flink-ui.png":::

    :::image type="content" source="./media/use-flink-delta-connector/view-the-metrics-on-flink-ui.png" alt-text="Screenshot shows the metrics on Flink UI." lightbox="./media/use-flink-delta-connector/view-the-metrics-on-flink-ui.png":::

## Power BI integration

Once the data is in delta sink, you can run the query in Power BI desktop and create a report.
1. Open your Power BI desktop and get the data using ADLS Gen2 connector.

    :::image type="content" source="./media/use-flink-delta-connector/view-power-bi-desktop.png" alt-text="Screenshot shows Power BI desktop.":::

    :::image type="content" source="./media/use-flink-delta-connector/view-adls-gen2-connector.png" alt-text="Screenshot shows ADLSGen 2 connector.":::

1. URL of the storage account.

    :::image type="content" source="./media/use-flink-delta-connector/url-of-the-storage-account.png" alt-text="Screenshot showing the URL of the storage account.":::

    :::image type="content" source="./media/use-flink-delta-connector/adls-gen-2-details.png" alt-text="Screenshot shows ADLS Gen2-details.":::

1. Create M-query for the source and invoke the function, which queries the data from storage account. Refer [Delta Power BI connectors](https://github.com/delta-io/connectors/tree/master/powerbi).

1. Once the data is readily available, you can create reports.

    :::image type="content" source="./media/use-flink-delta-connector/create-reports.png" alt-text="Screenshot shows how to create reports.":::

## References

* [Delta connectors](https://github.com/delta-io/connectors/tree/master/flink).
* [Delta Power BI connectors](https://github.com/delta-io/connectors/tree/master/powerbi).
