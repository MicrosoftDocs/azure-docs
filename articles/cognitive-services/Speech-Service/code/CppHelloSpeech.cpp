// CppHelloSpeech.cpp : Defines the entry point for the console application.
//

// <code>
#include "stdafx.h"
#include <iostream> // wcin, wcout
#include <speechapi_cxx.h>

using namespace std;
using namespace Microsoft::CognitiveServices::Speech;

void recognizeSpeech() {
    wstring subscriptionKey{ L"<Please replace with your subscription key>" };
    wstring region{ L"<Please replace with your service region>" };

    auto factory = SpeechFactory::FromSubscription(subscriptionKey, region);

    auto recognizer = factory->CreateSpeechRecognizer();

    wcout << "Say something...\n";
    auto future = recognizer->RecognizeAsync();
    auto result = future.get();

    if (result->Reason != Reason::Recognized) {
        wcout << L"There was an error, reason " << int(result->Reason) << L" - " << result->ErrorDetails << '\n';
    }
    else {
        wcout << L"We recognized: " << result->Text << '\n';
    }
    wcout << L"Please press a key to continue.\n";
    wcin.get();
}

int main()
{
    recognizeSpeech();
    return 0;
}
// </code>
