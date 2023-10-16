---
author: shreyaaithal
ms.author: shaithal
ms.topic: include
ms.date: 08/15/2022
---

To make any changes to your code, go to Visual Studio Code in the browser:

1. Select the **Source Control** extension.

1. Next to the changed file, for example *database.php*, select **+** to stage your changes.

1. In the textbox, type a commit message, for example `add certificate`.

1. Select the checkmark to commit and push to GitHub.

If you go back to the Deployment Center page, you'll see a new log entry because another run is started. Wait for the run to complete. It takes about 15 minutes.

> [!TIP]
> The GitHub action is defined by the file in your GitHub repository, in *.github/workflow*. You can make it faster by customizing the file.
