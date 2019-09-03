---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 06/24/2019
ms.author: aahi
---

## Configure an environment variable for authentication

Applications need to authenticate access to the Cognitive Services they use. To authenticate, we recommend creating an environment variable to store the keys for your Azure Resources. 

After you have your key, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `your-key` with one of the keys for your resource.

* Windows

    ```console
    setx COGNITIVE_SERVICE_KEY "your-key"
    ```

    After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example.

* Linux
    
    ```bash
    export COGNITIVE_SERVICE_KEY=your-key
    ```
    
    After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.
    
* macOS
    
    Edit your .bash_profile, and add the environment variable:
    
    ```bash
    export COGNITIVE_SERVICE_KEY=your-key
    ```
    
    After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
