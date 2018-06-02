---
title: How to use Microsoft Translator Text API with Java, Azure Cognitive Services | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Microsoft Translator Text API in Microsoft Cognitive Services on Azure.
services: cognitive-services
documentationcenter: ''
author: Jann-Skotdal
ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 09/14/2017
ms.author: v-jansko
---
# How to use the Microsoft Translator Text API with Java

<a name="HOLTop"></a>

This article shows you how to use the [Microsoft Translator API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-info-overview) with Java to do the following.

- [Get supported languages.](#Languages)
- [Translate source text from one language to another.](#Translate)
- [Identify the language of the source text.](#Detect)
- [Break the source text into sentences.](#BreakSentence)
- [Convert text in one language from one script to another script.](#Transliterate)
- [Get alternate translations for a word.](#DictionaryLookup)
- [Get examples of how to use terms in the dictionary.](#DictionaryExamples)


## Prerequisites

You will need [JDK 7 or 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) to compile and run this code. You may use a Java IDE if you have a favorite, but a text editor will suffice.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Microsoft Translator Text API**. You will need a paid subscription key from your [Azure dashboard](https://portal.azure.com/#create/Microsoft.CognitiveServices).

<a name="GetLanguageNames"></a>

## Get language names

The following code gets a list of languages supported for translation, transliteration, and dictionary lookup and examples, using the [Languages](../reference/v3-0-languages.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as Languages.java.
2. Run:
	javac Languages.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar Languages
*/

public class Languages {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/languages?api-version=3.0";

	static String output_path = "output.txt";

	public static String GetLanguages () throws Exception {
		URL url = new URL (host + path);

		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setDoOutput(true);

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));

		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonObject json = parser.parse(json_text).getAsJsonObject();
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void WriteToFile (String data) throws Exception {
		String json = prettify (data);
		Writer outputStream = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(output_path), "UTF-8"));
		outputStream.write(json);
		outputStream.close();
	}

	public static void main(String[] args) {
		try {
			String response = GetLanguages ();
			WriteToFile (response);
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Languages response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "translation": {
    "af": {
      "name": "Afrikaans",
      "nativeName": "Afrikaans",
      "dir": "ltr"
    },
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "dir": "rtl"
    },
...
  },
  "transliteration": {
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "scripts": [
        {
          "code": "Arab",
          "name": "Arabic",
          "nativeName": "العربية",
          "dir": "rtl",
          "toScripts": [
            {
              "code": "Latn",
              "name": "Latin",
              "nativeName": "اللاتينية",
              "dir": "ltr"
            }
          ]
        },
        {
          "code": "Latn",
          "name": "Latin",
          "nativeName": "اللاتينية",
          "dir": "ltr",
          "toScripts": [
            {
              "code": "Arab",
              "name": "Arabic",
              "nativeName": "العربية",
              "dir": "rtl"
            }
          ]
        }
      ]
    },
...
  },
  "dictionary": {
    "af": {
      "name": "Afrikaans",
      "nativeName": "Afrikaans",
      "dir": "ltr",
      "translations": [
        {
          "name": "English",
          "nativeName": "English",
          "dir": "ltr",
          "code": "en"
        }
      ]
    },
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "dir": "rtl",
      "translations": [
        {
          "name": "English",
          "nativeName": "English",
          "dir": "ltr",
          "code": "en"
        }
      ]
    },
...
  }
}
```

[Back to top](#HOLTop)

<a name="Translate"></a>

## Translate text

The following code translates source text from one language to another, using the [Translate](../reference/v3-0-translate.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as Translate.java.
2. Run:
	javac Translate.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar Translate
*/

public class Translate {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/translate?api-version=3.0";

    // Translate to German and Italian.
    static String params = "&to=de&to=it";

	static String text = "Hello world!";

	public static class RequestBody {
		String Text;

		public RequestBody(String text) {
			this.Text = text;
		}
	}

	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String Translate () throws Exception {
		URL url = new URL (host + path + params);

		List<RequestBody> objList = new ArrayList<RequestBody>();
		objList.add(new RequestBody(text));
		String content = new Gson().toJson(objList);

		return Post(url, content);
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = Translate ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Translate response**

A successful response is returned in JSON, as shown in the following example: 

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "translations": [
      {
        "text": "Hallo Welt!",
        "to": "de"
      },
      {
        "text": "Salve, mondo!",
        "to": "it"
      }
    ]
  }
]
```

[Back to top](#HOLTop)

<a name="Detect"></a>

## Detect language

The following code identifies the language of the source text, using the [Detect](../reference/v3-0-detect.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as Detect.java.
2. Run:
	javac Detect.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar Detect
*/

public class Detect {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/detect?api-version=3.0";

	static String text = "Salve, mondo!";

	public static class RequestBody {
		String Text;

		public RequestBody(String text) {
			this.Text = text;
		}
	}

	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String Detect () throws Exception {
		URL url = new URL (host + path);

		List<RequestBody> objList = new ArrayList<RequestBody>();
		objList.add(new RequestBody(text));
		String content = new Gson().toJson(objList);

		return Post(url, content);
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = Detect ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Detect language response**

A successful response is returned in JSON, as shown in the following example: 

```json
[
  {
    "language": "it",
    "score": 1.0,
    "isTranslationSupported": true,
    "isTransliterationSupported": false,
    "alternatives": [
      {
        "language": "pt",
        "score": 1.0,
        "isTranslationSupported": true,
        "isTransliterationSupported": false
      },
      {
        "language": "en",
        "score": 1.0,
        "isTranslationSupported": true,
        "isTransliterationSupported": false
      }
    ]
  }
]
```

[Back to top](#HOLTop)

<a name="BreakSentence"></a>

## Break sentences

The following code breaks the source text into sentences, using the [BreakSentence](../reference/v3-0-break-sentence.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as BreakSentences.java.
2. Run:
	javac BreakSentences.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar BreakSentences
*/

public class BreakSentences {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/breaksentence?api-version=3.0";

	static String text = "How are you? I am fine. What did you do today?";

	public static class RequestBody {
		String Text;

		public RequestBody(String text) {
			this.Text = text;
		}
	}

	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String BreakSentences () throws Exception {
		URL url = new URL (host + path);

		List<RequestBody> objList = new ArrayList<RequestBody>();
		objList.add(new RequestBody(text));
		String content = new Gson().toJson(objList);

		return Post(url, content);
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = BreakSentences ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Break sentences response**

A successful response is returned in JSON, as shown in the following example: 

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "sentLen": [
      13,
      11,
      22
    ]
  }
]
```

[Back to top](#HOLTop)

<a name="Transliterate"></a>

## Transliterate

The following converts text in one language from one script to another script, using the [Transliterate](../reference/v3-0-transliterate.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as Transliterate.java.
2. Run:
	javac Transliterate.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar Transliterate
*/

public class Transliterate {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/transliterate?api-version=3.0";

	// Transliterate text in Japanese from Japanese script (i.e. Hiragana/Katakana/Kanji) to Latin script.
	static String params = "&language=ja&fromScript=jpan&toScript=latn";

	// Transliterate "good afternoon".
    static String text = "こんにちは";

	public static class RequestBody {
		String Text;

		public RequestBody(String text) {
			this.Text = text;
		}
	}

	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String Transliterate () throws Exception {
		URL url = new URL (host + path + params);

		List<RequestBody> objList = new ArrayList<RequestBody>();
		objList.add(new RequestBody(text));
		String content = new Gson().toJson(objList);

		return Post(url, content);
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = Transliterate ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Transliterate response**

A successful response is returned in JSON, as shown in the following example: 

```json
[
  {
    "text": "konnnichiha",
    "script": "latn"
  }
]
```

[Back to top](#HOLTop)

<a name="DictionaryLookup"></a>

## Dictionary lookup

The following gets alternate translations for a word, using the [DictionaryLookup](../reference/v3-0-dictionary-lookup.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as DictionaryLookup.java.
2. Run:
	javac DictionaryLookup.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar DictionaryLookup
*/

public class DictionaryLookup {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/dictionary/lookup?api-version=3.0";

	static String params = "&from=en&to=fr";

    static String text = "great";

	public static class RequestBody {
		String Text;

		public RequestBody(String text) {
			this.Text = text;
		}
	}

	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String DictionaryLookup () throws Exception {
		URL url = new URL (host + path + params);

		List<RequestBody> objList = new ArrayList<RequestBody>();
		objList.add(new RequestBody(text));
		String content = new Gson().toJson(objList);

		return Post(url, content);
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = DictionaryLookup ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**DictionaryLookup response**

A successful response is returned in JSON, as shown in the following example: 

```json
[
  {
    "normalizedSource": "great",
    "displaySource": "great",
    "translations": [
      {
        "normalizedTarget": "grand",
        "displayTarget": "grand",
        "posTag": "ADJ",
        "confidence": 0.2783,
        "prefixWord": "",
        "backTranslations": [
          {
            "normalizedText": "great",
            "displayText": "great",
            "numExamples": 15,
            "frequencyCount": 34358
          },
          {
            "normalizedText": "big",
            "displayText": "big",
            "numExamples": 15,
            "frequencyCount": 21770
          },
...
        ]
      },
      {
        "normalizedTarget": "super",
        "displayTarget": "super",
        "posTag": "ADJ",
        "confidence": 0.1514,
        "prefixWord": "",
        "backTranslations": [
          {
            "normalizedText": "super",
            "displayText": "super",
            "numExamples": 15,
            "frequencyCount": 12023
          },
          {
            "normalizedText": "great",
            "displayText": "great",
            "numExamples": 15,
            "frequencyCount": 10931
          },
...
        ]
      },
...
    ]
  }
]
```

[Back to top](#HOLTop)

<a name="DictionaryExamples"></a>

## Dictionary examples

The following gets examples of how to use a term in the dictionary, using the [DictionaryExamples](../reference/v3-0-dictionary-examples.md) method.

1. Create a new Java project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```java
import java.io.*;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *     groupId: com.google.code.gson
 *     artifactId: gson
 *     version: 2.8.1
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/* NOTE: To compile and run this code:
1. Save this file as DictionaryExamples.java.
2. Run:
	javac DictionaryExamples.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar DictionaryExamples
*/

public class DictionaryExamples {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
	static String subscriptionKey = "ENTER KEY HERE";

	static String host = "https://api.cognitive.microsofttranslator.com";
	static String path = "/dictionary/examples?api-version=3.0";

	static String params = "&from=en&to=fr";

    static String text = "great";
    static String translation = "formidable";

	public static class RequestBody {
		String Text;
		String Translation;

		public RequestBody(String text, String translation) {
			this.Text = text;
			this.Translation = translation;
		}
	}

	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Ocp-Apim-Subscription-Key", subscriptionKey);
		connection.setRequestProperty("X-ClientTraceId", java.util.UUID.randomUUID().toString());
		connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
		byte[] encoded_content = content.getBytes("UTF-8");
		wr.write(encoded_content, 0, encoded_content.length);
		wr.flush();
		wr.close();

		StringBuilder response = new StringBuilder ();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
		String line;
		while ((line = in.readLine()) != null) {
			response.append(line);
		}
		in.close();

		return response.toString();
	}

	public static String DictionaryExamples () throws Exception {
		URL url = new URL (host + path + params);

		List<RequestBody> objList = new ArrayList<RequestBody>();
		objList.add(new RequestBody(text, translation));
		String content = new Gson().toJson(objList);

		return Post(url, content);
    }

	public static String prettify(String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

	public static void main(String[] args) {
		try {
			String response = DictionaryExamples ();
			System.out.println (prettify (response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**DictionaryExamples response**

A successful response is returned in JSON, as shown in the following example: 

```json
[
  {
    "normalizedSource": "great",
    "normalizedTarget": "formidable",
    "examples": [
      {
        "sourcePrefix": "You have a ",
        "sourceTerm": "great",
        "sourceSuffix": " expression there.",
        "targetPrefix": "Vous avez une expression ",
        "targetTerm": "formidable",
        "targetSuffix": "."
      },
      {
        "sourcePrefix": "You played a ",
        "sourceTerm": "great",
        "sourceSuffix": " game today.",
        "targetPrefix": "Vous avez été ",
        "targetTerm": "formidable",
        "targetSuffix": "."
      },
...
    ]
  }
]
```

[Back to top](#HOLTop)

## Next steps

> [!div class="nextstepaction"]
> [Translator Text tutorial (V3)](../tutorial-wpf-translation-csharp.md)

## See also 

[Translator Text overview](../text-overview.md)
[API Reference](../reference/v3-0-reference.md)
