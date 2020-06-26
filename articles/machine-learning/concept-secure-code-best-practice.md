---
title: Secure code best practices
titleSuffix: Azure Machine Learning
description: Learn about potential security vulnerabilities that may exist when developing for Azure Machine Learning. Learn about the mitigations that Azure ML provides, as well as best practices to ensure that your development environments remain secure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: larryfr
author: larryfr
ms.date: 11/12/2019
---

## Secure code best practices with Azure Machine Learning

In Azure Machine Learning, you can upload files and content from any source. Content within Jupyter notebooks or scripts can potentially read data from your sessions, access data within your organization in Azure, or run malicious processes on your behalf.

> [!IMPORTANT]
> Only run notebooks or scripts from trusted sources. For example, where you or your security team have reviewed the notebook or script.

## Potential vulnerabilities

Development with Azure Machine Learning often involves web-based development environments (Notebooks & Azure ML studio). When using web-based development environments, the potential vulnerabilities are:

* [Cross site scripting (XSS)](https://owasp.org/www-community/attacks/xss/)

    * __Dom injection__: This type of attack can modify the UI displayed in the browser. For example, by changing how the run button behaves in a Jupyter Notebook.
    * __Access token/cookies__: XSS attacks can also access local storage and browser cookies. Your Azure Active Directory (AAD) authentication token is stored in local storage. An XSS attack could use this token to make API calls on your behalf, and then send the data to an external system or API.

* [Cross site request forgery (CSRF)](https://owasp.org/www-community/attacks/csrf): This attack may replace the URL of an image or link with the URL of a malicious script or API. When the image is loaded, or link clicked, a call is made to the URL.

The following table provides a matrix of the threats and attack surfaces that apply with Azure Machine Learning:

| Attack surface | XSS</br>Dom injection | XSS</br>Theft of tokens/cookies | CSRF |
| ---- | ---- | ---- | ---- |
| __Azure ML studio notebooks__ | | |
| __Jupyter/JupyterLab on compute instance__ | | |
| __RStudio on compute instance__ | | |
| __Compute cluster__ | | |
| __SDK on local computer__ | | |

## Azure ML studio notebooks

__Possible vulnerabilities__:
* Cross site scripting (XSS)
* Cross site request forgery (CSRF)

Azure Machine Learning studio provides a hosted notebook experience in your browser. Cells in a notebook can output HTML documents or fragments that contain malicious code.  When the output is rendered, the code can be executed.

__Mitigations provided by Azure Machine Learning__:
* __Coode cell output__ is sandboxed in an iframe. The iframe prevents the script from accessing the parent DOM, cookies, or session storage.
* __Markdown cell__ contents are cleaned using the dompurify library. This blocks malicious scripts from executing with markdown cells are rendered.
* __Image URL__ and __Markdown links__ are not directly requested. Instead, the URL for the image or link is sent to a Microsoft owned endpoint which checks for malicious values. If a malicious value is detected, the endpoint rejects the request.

__Required actions__:
* Verify that you trust the contents of files before uploading to studio. When uploading, you must acknowledge that you are uploading trusted files.
* When selecting a link to open an external application, you will be prompted to trust the application.

## Azure ML Compute instance

## Report security issues or concerns 

Azure Machine Learning is eligible under the Microsoft Azure Bounty Program. For more information, visit [https://www.microsoft.com/msrc/bounty-microsoft-azure](https://www.microsoft.com/msrc/bounty-microsoft-azure).