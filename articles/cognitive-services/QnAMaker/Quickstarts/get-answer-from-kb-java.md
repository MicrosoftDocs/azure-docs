## Get answers to a question by using a knowledge base

The following code gets answers to a question using the specified knowledge base, using the **Generate answers** method.

1. Create a new Java project in your favorite IDE.
1. Add the code provided below.
1. Replace the `host` value with the Website name for your QnA Maker subscription. For more information see [Create a QnA Maker service](../How-To/set-up-qnamaker-service-azure.md).
1. Replace the `endpoint_key` value with a valid endpoint key for your subscription. Note this is not the same as your subscription key. You can get your endpoint keys using the [Get endpoint keys](#GetKeys) method.
1. Replace the `kb` value with the ID of the knowledge base you want to query for answers. Note this knowledge base must already have been published using the [Publish](#Publish) method.
1. Run the program.

```java
import java.io.*;
import java.lang.reflect.Type;
import java.net.*;
import java.util.*;
import javax.net.ssl.HttpsURLConnection;

/*
 * Gson: https://github.com/google/gson
 * Maven info:
 *    <dependency>
 *      <groupId>com.google.code.gson</groupId>
 *      <artifactId>gson</artifactId>
 *      <version>2.8.1</version>
 *    </dependency>
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

/* NOTE: To compile and run this code:
1. Save this file as GetAnswers.java.
2. Run:
	javac GetAnswers.java -cp .;gson-2.8.1.jar -encoding UTF-8
3. Run:
	java -cp .;gson-2.8.1.jar GetAnswers
*/

public class GetAnswers {

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

	// NOTE: Replace this with a valid host name.
	static String host = "ENTER HOST HERE";

	// NOTE: Replace this with a valid endpoint key.
	// This is not your subscription key.
	// To get your endpoint keys, call the GET /endpointkeys method.
	static String endpoint_key = "ENTER KEY HERE";

	// NOTE: Replace this with a valid knowledge base ID.
	// Make sure you have published the knowledge base with the
	// POST /knowledgebases/{knowledge base ID} method.
	static String kb = "ENTER KB ID HERE";

	static String method = "/qnamaker/knowledgebases/" + kb + "/generateAnswer";

	static String question = "{ 'question' : 'Is the QnA Maker Service free?', 'top' : 3 }";

	public static String PrettyPrint (String json_text) {
		JsonParser parser = new JsonParser();
		JsonElement json = parser.parse(json_text);
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(json);
	}

// Send an HTTP POST request.
	public static String Post (URL url, String content) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
		connection.setRequestMethod("POST");
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("Content-Length", content.length() + "");
		connection.setRequestProperty("Authorization", "EndpointKey " + endpoint_key);
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

	public static String GetAnswers (String kb, String question) throws Exception {
		URL url = new URL(host + method);
		System.out.println ("Calling " + url.toString() + ".");
		return Post(url, question);
    }

	public static void main(String[] args) {
		try {
			String response = GetAnswers (kb, question);
			System.out.println (PrettyPrint(response));
		}
		catch (Exception e) {
			System.out.println (e);
		}
	}
}
```

**Get answers response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "answers": [
    {
      "questions": [
        "Can I use BitLocker with the Volume Shadow Copy Service?"
      ],
      "answer": "Yes. However, shadow copies made prior to enabling BitLocker will be automatically deleted when BitLocker is enabled on software-encrypted drives. If you are using a hardware encrypted drive, the shadow copies are retained.",
      "score": 17.3,
      "id": 62,
      "source": "https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-frequently-asked-questions",
      "metadata": []
    },
...
  ]
}
```
