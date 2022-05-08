---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 10/15/2020
ms.author: erhopf
---

1. Start Eclipse.

1. In Eclipse Launcher, in the **Workspace** box, enter the name of a new workspace directory. Then select **Launch**.

   ![Screenshot of Eclipse Launcher.](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-01-create-new-eclipse-workspace.png)

1. In a moment, the main window of the Eclipse IDE appears. Close the **Welcome** screen if one is present.

1. From the Eclipse menu bar, create a new project by selecting **File** > **New** > **Project**.

1. The **New Project** dialog appears. Select **Java Project**, and then select **Next**.

   ![Screenshot of the New Project dialog, with Java Project highlighted.](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-02-select-wizard.png)

1. The **New Java Project** wizard starts. In the **Project name** field, enter **quickstart**. Choose **JavaSE-1.8** as the execution environment. Select **Finish**.

   ![Screenshot of the New Java Project wizard, with selections for creating a Java project.](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-03-create-java-project.png)

1. If the **Open Associated Perspective?** window appears, select **Open Perspective**.

1. In **Package Explorer**, right-click the **quickstart** project. Select **Configure** > **Convert to Maven Project** from the shortcut menu.

   ![Screenshot of Package Explorer and the commands for converting to a Maven project.](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-04-convert-to-maven-project.png)

1. The **Create new POM** window appears. In the **Group Id** field, enter **com.microsoft.cognitiveservices.speech.samples**. In the **Artifact Id** field, enter **quickstart**. Then select **Finish**.

   ![Screenshot of the window for creating a new POM.](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-05-configure-maven-pom.png)

1. Open the *pom.xml* file and edit it:

   * At the end of the file, before the closing tag `</project>`, create a `repositories` element with a reference to the Maven repository for the Speech SDK:

     [!code-xml[POM Repositories](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/pom.xml#repositories)]

   * Add a `dependencies` element, with Speech SDK version 1.21.0 as a dependency:

     [!code-xml[POM Dependencies](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/pom.xml#dependencies)]

   * Save the changes.
