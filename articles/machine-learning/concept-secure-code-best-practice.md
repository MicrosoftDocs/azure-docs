---
title: Secure code best practices
titleSuffix: Azure Machine Learning
description: Learn about potential security threats that may exist when developing for Azure Machine Learning, mitigations, and best practices.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: deeikele
author: deeikele 
ms.reviewer: larryfr
ms.date: 11/04/2022
---

# Secure code best practices with Azure Machine Learning

In Azure Machine Learning, you can upload files and content from any source into Azure. Content within Jupyter notebooks or scripts that you load can potentially read data from your sessions, access data within your organization in Azure, or run malicious processes on your behalf.

> [!IMPORTANT]
> Only run notebooks or scripts from trusted sources. For example, where you or your security team have reviewed the notebook or script.

## Potential threats

Development with Azure Machine Learning often involves web-based development environments (Notebooks & Azure Machine Learning studio). When you use web-based development environments, the potential threats are:

* [Cross site scripting (XSS)](https://owasp.org/www-community/attacks/xss/)

    * __DOM injection__: This type of attack can modify the UI displayed in the browser. For example, by changing how the run button behaves in a Jupyter Notebook.
    * __Access token/cookies__: XSS attacks can also access local storage and browser cookies. Your Azure Active Directory (Azure AD) authentication token is stored in local storage. An XSS attack could use this token to make API calls on your behalf, and then send the data to an external system or API.

* [Cross site request forgery (CSRF)](https://owasp.org/www-community/attacks/csrf): This attack may replace the URL of an image or link with the URL of a malicious script or API. When the image is loaded, or link clicked, a call is made to the URL.

## Azure Machine Learning studio notebooks

Azure Machine Learning studio provides a hosted notebook experience in your browser. Cells in a notebook can output HTML documents or fragments that contain malicious code.  When the output is rendered, the code can be executed.

__Possible threats__:
* Cross site scripting (XSS)
* Cross site request forgery (CSRF)

__Mitigations provided by Azure Machine Learning__:
* __Code cell output__ is sandboxed in an iframe. The iframe prevents the script from accessing the parent DOM, cookies, or session storage.
* __Markdown cell__ contents are cleaned using the dompurify library. This blocks malicious scripts from executing with markdown cells are rendered.
* __Image URL__ and __Markdown links__ are sent to a Microsoft owned endpoint, which checks for malicious values. If a malicious value is detected, the endpoint rejects the request.

__Recommended actions__:
* Verify that you trust the contents of files before uploading to studio. When uploading, you must acknowledge that you're uploading trusted files.
* When selecting a link to open an external application, you'll be prompted to trust the application.

## Azure Machine Learning compute instance

Azure Machine Learning compute instance hosts __Jupyter__ and __Jupyter Lab__. When you use either, cells in a notebook or code in can output HTML documents or fragments that contain malicious code. When the output is rendered, the code can be executed. The same threats also apply when you use __RStudio__ and __Posit Workbench (formerly RStudio Workbench)__ hosted on a compute instance.

__Possible threats__:
* Cross site scripting (XSS)
* Cross site request forgery (CSRF)

__Mitigations provided by Azure Machine Learning__:
* None. Jupyter and Jupyter Lab are open-source applications hosted on the Azure Machine Learning compute instance.

__Recommended actions__:
* Verify that you trust the contents of files before uploading to studio. When uploading, you must acknowledge that you're uploading trusted files.

## Report security issues or concerns 

Azure Machine Learning is eligible under the Microsoft Azure Bounty Program. For more information, visit [https://www.microsoft.com/msrc/bounty-microsoft-azure](https://www.microsoft.com/msrc/bounty-microsoft-azure).

## Next steps

* [Enterprise security for Azure Machine Learning](concept-enterprise-security.md)