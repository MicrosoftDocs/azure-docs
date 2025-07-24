---
author: msangapu-msft
ms.service: azure-app-service
ms.topic: include
ms.date: 05/01/2025
ms.author: msangapu
---

### <a name="acceptablefiles"></a>Supported file types for scripts or programs

### [Windows code](#tab/windowscode)

The following file types are supported:

- Using Windows cmd: *.cmd*, *.bat*, *.exe*
- Using PowerShell: *.ps1*
- Using Bash: *.sh*
- Using Node.js: *.js*
- Using Java: *.jar*

The necessary runtimes to run these file types are already installed on the web app instance.

### [Windows container](#tab/windowscontainer)

The following file types are supported using Windows cmd: *.cmd*, *.bat*, *.exe*

In addition to these file types, WebJobs written in the language runtime of the Windows container app are supported.

- Example: *.jar* and *.war* scripts are supported if the container is a Java app.

### [Linux code](#tab/linuxcode)

*.sh* scripts are supported.

In addition to shell scripts, WebJobs written in the language of the selected runtime are also supported.

- Example: Python (*.py*) scripts are supported if the main site is a Python app.

### [Linux container](#tab/linuxcontainer)

*.sh* scripts are supported.

In addition to shell scripts, WebJobs written in the language runtime of the Linux container app are also supported.

- Example: Node (*.js*) scripts are supported if the site is a Node.js app.

---