---
title: Java Quickstart for Azure Cognitive Services, Microsoft Translator Text API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: v-jaswel

ms.service: cognitive-services
ms.technology: translator-text
ms.topic: article
ms.date: 09/14/2017
ms.author: v-jaswel

---
# Quickstart for Microsoft Translator Text API with Java 
<a name="HOLTop"></a>

This article shows you how to use the [Microsoft Translator API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-info-overview) with Java to do the following.

- [Translate source text from one language to another.](#Translate)
- [Get translations for multiple source texts.](#TranslateArray)
- [Get friendly names for multiple languages.](#GetLanguageNames)
- [Get a list of languages available for translation.](#GetLanguagesForTranslate)
- [Get a list of languages available for speech synthesis.](#GetLanguagesForSpeak)
- [Get a .wav or .mp3 stream of the source text being spoken in the given language.](#Speak)
- [Identify the language of the source text.](#Detect)
- [Identify the languages for multiple source texts.](#DetectArray)
- [Add a translation to the translation memory.](#AddTranslation)
- [Add an array of translations to add translation memory.](#AddTranslationArray)
- [Break the source text into sentences.](#BreakSentences)
- [Get an array of translations for the source text.](#GetTranslations)
- [Get arrays of translations for multiple source texts.](#GetTranslationsArray)

## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Text API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="Translate"></a>

## Translate text

The following code translates source text from one language to another, using the [Translate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Translate) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/Translate";

	static String target = "fr-fr";
	static String text = "Hello";

	public static String Translate () throws Exception {
        String encoded_query = URLEncoder.encode (text, "UTF-8");
        String params = "?to=" + target + "&text=" + text;
		URL url = new URL (host + path + params);

		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
    }

	public static void main(String[] args) {
		try {
			String response = Translate ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Translate response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">Salut</string>
```

[Back to top](#HOLTop)

<a name="TranslateArray"></a>

## Translate text array

The following code gets translations for multiple soruce texts, using the [TranslateArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_TranslateArray) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/TranslateArray";

	public static String post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "text/xml");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String TranslateArray () throws Exception {
		URL url = new URL (host + path);
		String ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
		String xml =
			"<TranslateArrayRequest>" +
			// NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
			"	<AppId />" +
			"	<Texts>" +
			"		<string xmlns=\"" + ns + "\">Hello</string>" +
			"		<string xmlns=\"" + ns + "\">Goodbye</string>" +
			"	</Texts>" +
			"	<To>fr-fr</To>" +
			"</TranslateArrayRequest>";

		return post (url, xml);
    }

	public static void main(String[] args) {
		try {
			String response = TranslateArray ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Translate array response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfTranslateArrayResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <TranslateArrayResponse>
    <From>en</From>
    <OriginalTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>5</a:int>
    </OriginalTextSentenceLengths>
    <TranslatedText>Salut</TranslatedText>
    <TranslatedTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>5</a:int>
    </TranslatedTextSentenceLengths>
  </TranslateArrayResponse>
  <TranslateArrayResponse>
    <From>en</From>
    <OriginalTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>7</a:int>
    </OriginalTextSentenceLengths>
    <TranslatedText>Au revoir</TranslatedText>
    <TranslatedTextSentenceLengths xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
      <a:int>9</a:int>
    </TranslatedTextSentenceLengths>
  </TranslateArrayResponse>
</ArrayOfTranslateArrayResponse>
```

[Back to top](#HOLTop)

<a name="GetLanguageNames"></a>

## Get language names

The following code gets friendly names for multiple languages, using the [GetLanguageNames](http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetLanguageNames) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

    static String locale = "en";
	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/GetLanguageNames?locale=" + locale;

	public static String post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "text/xml");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String GetLanguageNames () throws Exception {
		URL url = new URL (host + path);
		String ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
		String xml =
			"<ArrayOfstring xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">" +
            "    <string>en</string>" +
            "    <string>fr</string>" +
            "    <string>uk</string>" +
            "</ArrayOfstring>";

		return post (url, xml);
    }

	public static void main(String[] args) {
		try {
			String response = GetLanguageNames ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get language names response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>English</string>
  <string>French</string>
  <string>Ukrainian</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="GetLanguagesForTranslate"></a>

## Get supported languages for translation

The following code gets a list of language codes representing languages supported for translation, using the [GetLanguagesForTranslate](http://docs.microsofttranslator.com/text-translate.html#!/default/get_GetLanguagesForTranslate) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/GetLanguagesForTranslate";

	public static String get (URL url) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String GetLanguagesForTranslate () throws Exception {
		String url = host + path;
		URL url2 = new URL (url);

		return get (url2);
    }

	public static void main(String[] args) {
		try {
			String response = GetLanguagesForTranslate ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get supported languages for translation response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>af</string>
  <string>ar</string>
  <string>bn</string>
  <string>bs-Latn</string>
  <string>bg</string>
  <string>ca</string>
  <string>zh-CHS</string>
  <string>zh-CHT</string>
  <string>yue</string>
  <string>hr</string>
  <string>cs</string>
  <string>da</string>
  <string>nl</string>
  <string>en</string>
  <string>et</string>
  <string>fj</string>
  <string>fil</string>
  <string>fi</string>
  <string>fr</string>
  <string>de</string>
  <string>el</string>
  <string>ht</string>
  <string>he</string>
  <string>hi</string>
  <string>mww</string>
  <string>hu</string>
  <string>id</string>
  <string>it</string>
  <string>ja</string>
  <string>sw</string>
  <string>tlh</string>
  <string>tlh-Qaak</string>
  <string>ko</string>
  <string>lv</string>
  <string>lt</string>
  <string>mg</string>
  <string>ms</string>
  <string>mt</string>
  <string>yua</string>
  <string>no</string>
  <string>otq</string>
  <string>fa</string>
  <string>pl</string>
  <string>pt</string>
  <string>ro</string>
  <string>ru</string>
  <string>sm</string>
  <string>sr-Cyrl</string>
  <string>sr-Latn</string>
  <string>sk</string>
  <string>sl</string>
  <string>es</string>
  <string>sv</string>
  <string>ty</string>
  <string>ta</string>
  <string>th</string>
  <string>to</string>
  <string>tr</string>
  <string>uk</string>
  <string>ur</string>
  <string>vi</string>
  <string>cy</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="GetLanguagesForSpeak"></a>

## Get supported languages for speech synthesis

The following code gets a list of language codes representing languages supported for speech synthesis, using the [GetLanguagesForSpeak](http://docs.microsofttranslator.com/text-translate.html#!/default/get_GetLanguagesForSpeak) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/GetLanguagesForSpeak";

	public static String get (URL url) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String GetLanguagesForSpeak () throws Exception {
		String url = host + path;
		URL url2 = new URL (url);

		return get (url2);
    }

	public static void main(String[] args) {
		try {
			String response = GetLanguagesForSpeak ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get supported languages for speech synthesis response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>ar</string>
  <string>ar-eg</string>
  <string>ca</string>
  <string>ca-es</string>
  <string>da</string>
  <string>da-dk</string>
  <string>de</string>
  <string>de-de</string>
  <string>en</string>
  <string>en-au</string>
  <string>en-ca</string>
  <string>en-gb</string>
  <string>en-in</string>
  <string>en-us</string>
  <string>es</string>
  <string>es-es</string>
  <string>es-mx</string>
  <string>fi</string>
  <string>fi-fi</string>
  <string>fr</string>
  <string>fr-ca</string>
  <string>fr-fr</string>
  <string>hi</string>
  <string>hi-in</string>
  <string>it</string>
  <string>it-it</string>
  <string>ja</string>
  <string>ja-jp</string>
  <string>ko</string>
  <string>ko-kr</string>
  <string>nb-no</string>
  <string>nl</string>
  <string>nl-nl</string>
  <string>no</string>
  <string>pl</string>
  <string>pl-pl</string>
  <string>pt</string>
  <string>pt-br</string>
  <string>pt-pt</string>
  <string>ru</string>
  <string>ru-ru</string>
  <string>sv</string>
  <string>sv-se</string>
  <string>yue</string>
  <string>zh-chs</string>
  <string>zh-cht</string>
  <string>zh-cn</string>
  <string>zh-hk</string>
  <string>zh-tw</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="Speak"></a>

## Get spoken text

The following code gets a stream of the source text being spoken in the given language, using the [Speak](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Speak) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/Speak";

	public static void get (URL url, String output_path) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

		InputStream inputStream = connection.getInputStream();
		FileOutputStream outputStream = new FileOutputStream(output_path);

		int bytesRead = -1;
		byte[] buffer = new byte[1024];
		while ((bytesRead = inputStream.read(buffer)) != -1) {
			outputStream.write(buffer, 0, bytesRead);
		}

		outputStream.close();
		inputStream.close();

		return;
	}

	public static void Speak () throws Exception {
		String text = "Hello world";
		String language = "en-US";
		String output_path = "speak.wav";

		String url = host + path + "?text=" + URLEncoder.encode (text, "UTF-8") + "&language=" + language;
		URL url2 = new URL (url);

		get (url2, output_path);
    }

	public static void main(String[] args) {
		try {
			Speak ();
			System.out.println ("File downloaded.");
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get spoken text response**

A successful response is returned as a .wav or .mp3 stream.

[Back to top](#HOLTop)

<a name="Detect"></a>

## Detect language

The following code identifies the language of the source text, using the [Detect](http://docs.microsofttranslator.com/text-translate.html#!/default/get_Detect) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/Detect";

	public static String get (URL url) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String Detect () throws Exception {
		String text = "Hello world";
		String url = host + path + "?text=" + URLEncoder.encode (text, "UTF-8");
		URL url2 = new URL (url);
		return get (url2);
    }

	public static void main(String[] args) {
		try {
			String response = Detect ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Detect language response**

A successful response is returned in XML, as shown in the following example: 

```xml
<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">en</string>
```

[Back to top](#HOLTop)

<a name="DetectArray"></a>

## Detect multiple languages

The following code identifies the languages for multiple source texts, using the [DetectArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_DetectArray) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/DetectArray";

	public static String post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "text/xml");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String DetectArray () throws Exception {
		URL url = new URL (host + path);
		String ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
		String xml =
			"<ArrayOfstring xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\">" +
            "    <string>Hello</string>" +
            "    <string>Bonjour</string>" +
            "    <string>Guten tag</string>" +
            "</ArrayOfstring>";

		return post (url, xml);
    }

	public static void main(String[] args) {
		try {
			String response = DetectArray ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Detect multiple languages response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfstring xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <string>en</string>
  <string>fr</string>
  <string>de</string>
</ArrayOfstring>
```

[Back to top](#HOLTop)

<a name="AddTranslation"></a>

## Add translation

The following code adds a translation to the translation memory, using the [AddTranslation](http://docs.microsofttranslator.com/text-translate.html#!/default/get_AddTranslation) method. This is useful if you want to tailor the user's experience so they receive a certain translation for a given source text.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/AddTranslation";

	public static String get (URL url) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String AddTranslation () throws Exception {
		String originalText = "Hi there";
		String translatedText = "Salut";
		String from = "en-US";
		String to = "fr-fr";
		String user = "JohnDoe";

		String url = host + path +
			"?originalText=" + URLEncoder.encode (originalText, "UTF-8") +
			"&translatedText=" + URLEncoder.encode (translatedText, "UTF-8") +
			"&from=" + from +
			"&to=" + to +
			"&user=" + URLEncoder.encode (user, "UTF-8");

		URL url2 = new URL (url);
		return get (url2);
    }

	public static void main(String[] args) {
		try {
			String response = AddTranslation ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Add translation response**

A successful response is simply returned as HTTP status code 200 (OK).

[Back to top](#HOLTop)

<a name="AddTranslationArray"></a>

## Add translation array

The following code adds an array of translations to the translation memory, using the [AddTranslationArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_AddTranslationArray) method. This is useful if you want to tailor the user's experience so they receive certain translations for given source texts.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/AddTranslationArray";

	public static String post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "text/xml");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String AddTranslationArray () throws Exception {
		URL url = new URL (host + path);

		String from = "en-us";
		String to = "fr-fr";
		String original = "Hi there";
		String translation = "Salut";
		String user = "JohnDoe";

		String ns = "http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2";
		String xml =
			"<AddtranslationsRequest>" +
			"  <AppId />" +
			"  <From>" + from + "</From>" +
			"  <Options>" +
			"    <User xmlns=\"" + ns + "\">" + user + "</User>" +
			"  </Options>" +
			"  <To>" + to + "</To>" +
			"  <Translations>" +
			"    <Translation xmlns=\"" + ns + "\">" +
			"      <OriginalText>" + original + "</OriginalText>" +
			"      <Rating>1</Rating>" +
			"      <TranslatedText>" + translation + "</TranslatedText>" +
			"    </Translation>" +
			"  </Translations>" +
			"</AddtranslationsRequest>";
		return post (url, xml);
    }

	public static void main(String[] args) {
		try {
			String response = AddTranslationArray ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Add translation array response**

A successful response is simply returned as HTTP status code 200 (OK).

[Back to top](#HOLTop)

<a name="BreakSentences"></a>

## Break sentences

The following code breaks the source text into sentences, using the [BreakSentences](http://docs.microsofttranslator.com/text-translate.html#!/default/get_BreakSentences) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/BreakSentences";

	public static String get (URL url) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String BreakSentences () throws Exception {
		String text = "Here is a sentence. Here is another sentence. Here is a third sentence.";
        String language = "en-US";

		String url = host + path +
			"?text=" + URLEncoder.encode (text, "UTF-8") +
			"&language=" + language;

		URL url2 = new URL (url);
		return get (url2);
    }

	public static void main(String[] args) {
		try {
			String response = BreakSentences ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Break sentences response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfint xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <int>20</int>
  <int>26</int>
  <int>25</int>
</ArrayOfint>
```

[Back to top](#HOLTop)

<a name="GetTranslations"></a>

## Get translations

The following code gets an array of translation candidates for the source text, using the [GetTranslations](http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetTranslations) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/GetTranslations";

	public static String post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "text/xml");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String GetTranslations () throws Exception {

		String from = "en-us";
		String to = "fr-fr";
		String text = "Hi there";
		String maxTranslations = "10";
		String url = host + path + "?from=" + from + "&to=" + to + "&maxTranslations=" + maxTranslations + "&text=" + URLEncoder.encode (text, "UTF-8");
		URL url2 = new URL (url);

		return post (url2, "");
    }

	public static void main(String[] args) {
		try {
			String response = GetTranslations ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get translations response**

A successful response is returned in XML, as shown in the following example: 

```xml
<GetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <From>en</From>
  <Translations>
    <TranslationMatch>
      <Count>0</Count>
      <MatchDegree>100</MatchDegree>
      <MatchedOriginalText />
      <Rating>5</Rating>
      <TranslatedText>Salut</TranslatedText>
    </TranslationMatch>
    <TranslationMatch>
      <Count>1</Count>
      <MatchDegree>100</MatchDegree>
      <MatchedOriginalText>Hi there</MatchedOriginalText>
      <Rating>1</Rating>
      <TranslatedText>Salut</TranslatedText>
    </TranslationMatch>
  </Translations>
</GetTranslationsResponse>
```

[Back to top](#HOLTop)

<a name="GetTranslationsArray"></a>

## Get translations arrays

The following code gets arrays of translation candidates for multiple source texts, using the [GetTranslationsArray](http://docs.microsofttranslator.com/text-translate.html#!/default/post_GetTranslationsArray) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

public class TranslateTextQuickStart {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the key string value with your valid subscription key.
	static String key = "ENTER KEY HERE";

	static String host = "https://api.microsofttranslator.com";
	static String path = "/V2/Http.svc/GetTranslationsArray";

	public static String post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "text/xml");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(
		new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String GetTranslationsArray () throws Exception {
		URL url = new URL (host + path);

		String from = "en-us";
		String to = "fr-fr";

		String ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
		String xml =
			"<GetTranslationsArrayRequest>" +
			"  <AppId />" +
			"  <From>" + from + "</From>" +
			"  <Texts>" +
			"    <string xmlns=\"" + ns + "\">Hello</string>" +
			"    <string xmlns=\"" + ns + "\">Goodbye</string>" +
			"  </Texts>" +
			"  <To>" + to + "</To>" +
			"  <MaxTranslations>10</MaxTranslations>" +
			"</GetTranslationsArrayRequest>";
		return post (url, xml);
    }

	public static void main(String[] args) {
		try {
			String response = GetTranslationsArray ();
			System.out.println (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get translations arrays response**

A successful response is returned in XML, as shown in the following example: 

```xml
<ArrayOfGetTranslationsResponse xmlns="http://schemas.datacontract.org/2004/07/Microsoft.MT.Web.Service.V2" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <GetTranslationsResponse>
    <From>en</From>
    <Translations>
      <TranslationMatch>
        <Count>0</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText />
        <Rating>5</Rating>
        <TranslatedText>Salut</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>2</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText>Hello</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Bonjour,</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText>Hello</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Bonjour</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>88</MatchDegree>
        <MatchedOriginalText>Hello?</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Tu es là ?</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>88</MatchDegree>
        <MatchedOriginalText>Hello?</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Vous êtes là ?</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>88</MatchDegree>
        <MatchedOriginalText>Hello,</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>Salut</TranslatedText>
      </TranslationMatch>
      <TranslationMatch>
        <Count>1</Count>
        <MatchDegree>66</MatchDegree>
        <MatchedOriginalText>&lt;&lt;"Hello!</MatchedOriginalText>
        <Rating>1</Rating>
        <TranslatedText>&lt;&lt; "Bonjour !</TranslatedText>
      </TranslationMatch>
    </Translations>
  </GetTranslationsResponse>
  <GetTranslationsResponse>
    <From>en</From>
    <Translations>
      <TranslationMatch>
        <Count>0</Count>
        <MatchDegree>100</MatchDegree>
        <MatchedOriginalText />
        <Rating>5</Rating>
        <TranslatedText>Au revoir</TranslatedText>
      </TranslationMatch>
    </Translations>
  </GetTranslationsResponse>
</ArrayOfGetTranslationsResponse>
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Translator Text tutorial](../tutorial-wpf-translation-csharp.md)

## See also 

[Translator Text overview](../text-overview.md)
[API Reference](http://docs.microsofttranslator.com/text-translate.html)
