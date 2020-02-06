---
title: Manage Jar dependencies best practice for Azure HDInsight 
description: Best practice of how to manage Jar dependencies for HDInsight applications safely.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive
ms.service: hdinsight
ms.topic: conceptual
ms.date: 02/05/2020
---

# Jar dependency management best practice

Components in HDInsight cluster have dependencies on third-party libraries. Usually, a specific version of common modules like Guava is referenced by these built-in components. When customers submit an application with its dependencies, they can bring a conflict version of the same module. If customer’s version is in the classpath first, built-in components may throw exceptions because of version incompatibility. While if built-in components inject the dependency to classpath first, customer’s application may throw errors like NoSuchMethod.

To avoid version conflict, consider shading your application dependencies.

## What does package shading mean?
Shading provides a way to include and rename dependencies. It relocates the classes and rewrites affected bytecode and resources to create a private copy of your dependencies.

## How to shade package?

### Use uber-jar
Uber-jar is a single jar file that contains both the application jar and its dependencies. The dependencies in Uber-jar are by-default not shaded. In some cases, this may introduce version conflict if other components or applications reference a different version of those libraries. To avoid this, customer can build Uber-Jar file with some (or all) of their dependencies shaded.

### Shade package using Maven
Maven can build applications written both in Java and Scala. Maven-shade-plugin can help you create a shaded uber-jar easily.

Below example in `pom.xml` shows how to shade package using maven-shade-plugin. `<relocation>…</relocation>` moves classes from package `com.google.guava` into package `com.google.shaded.guava` by moving the corresponding JAR file entries and rewriting the affected bytecode.

After changing `pom.xml`, you can execute `mvn package` to build the shaded uber-jar.

```xml
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.2.1</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <relocations>
                <relocation>
                  <pattern>com.google.guava</pattern>
                  <shadedPattern>com.google.shaded.guava</shadedPattern>
                </relocation>
              </relocations>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
```

### Shade package using SBT
SBT is also a build tool for Scala and Java. SBT doesn't have a shade plugin like maven-shade-plugin. You can modify `build.sbt` file to shade packages. 
For example, to shade `com.google.guava`, you can add below command to `build.sbt` file:

```scala
assemblyShadeRules in assembly := Seq(
  ShadeRule.rename("com.google.guava" -> "com.google.shaded.guava.@1").inAll
)
```

Then you can run `sbt clean` and `sbt assembly` to build the shaded jar file. 
