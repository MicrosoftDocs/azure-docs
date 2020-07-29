---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 02/10/2020
ms.author: erhopf
---

1. Start Eclipse.

1. In the Eclipse Launcher, in the **Workspace** field, enter the name of a new workspace directory. Then select **Launch**.

   ![Screenshot of Eclipse Launcher](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-01-create-new-eclipse-workspace.png)

1. In a moment, the main window of the Eclipse IDE appears. Close the **Welcome** screen if one is present.

1. From the Eclipse menu bar, create a new project by choosing **File** > **New** > **Project**.

1. The **New Project** dialog box appears. Select **Java Project**, and select **Next**.

   ![Screenshot of New Project dialog box, with Java Project highlighted](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-02-select-wizard.png)

1. The **New Java Project** wizard starts. In the **Project name** field, enter **quickstart**, and choose **JavaSE-1.8** as the execution environment. Select **Finish**.

   ![Screenshot of New Java Project wizard](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-03-create-java-project.png)

1. If the **Open Associated Perspective?** window appears, select **Open Perspective**.

1. In the **Package explorer**, right-click the **quickstart** project. Choose **Configure** > **Convert to Maven Project** from the context menu.

   ![Screenshot of Package explorer](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-04-convert-to-maven-project.png)

1. The **Create new POM** window appears. In the **Group Id** field, enter *com.microsoft.cognitiveservices.speech.samples*, and in the **Artifact Id** field, enter *quickstart*. Then select **Finish**.

   ![Screenshot of Create new POM window](../articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-05-configure-maven-pom.png)

1. Open the *pom.xml* file and edit it.

   * At the end of the file, before the closing tag `</project>`, create a `repositories` element with a reference to the Maven repository for the Speech SDK, as shown here:

     [!code-xml[POM Repositories](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/pom.xml#repositories)]

   * Also add a `dependencies` element, with the Speech SDK version 1.12.1 as a dependency:

     [!code-xml[POM Dependencies](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/pom.xml#dependencies)]

   * Save the changes.
