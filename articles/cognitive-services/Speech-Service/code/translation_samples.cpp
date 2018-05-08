//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

#include "stdafx.h"

// <toplevel>
#include <string>
#include <vector>
#include <speechapi_cxx.h>

using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Translation;
// </toplevel>


// Translation with microphone input.
// <TranslationWithMicrophone>
void TranslationWithMicrophone()
{
    // Creates an instance of a speech factory with specified
    // subscription key and service region. Replace with your own subscription key
    // and service region (e.g., "westus").
    auto factory = SpeechFactory::FromSubscription(L"YourSubscriptionKey", L"YourServiceRegion");

    // Sets source and target languages
    auto fromLanguage = L"en-US";
    vector<wstring> toLanguages { L"de", L"fr" };

    // Creates a translation recognizer using microphone as audio input.
    auto recognizer = factory->CreateTranslationRecognizer(fromLanguage, toLanguages);
    wcout << L"Say something...\n";

    // Starts translation. It returns when the first utterance has been recognized.
    auto result = recognizer->RecognizeAsync().get();

    // Checks result.
    if (result->Reason != Reason::Recognized)
    {
        wcout << L"There was an error in speech recognition, reason " << int(result->Reason) << L"-" << result->ErrorDetails << '\n';
    }
    else if (result->TranslationStatus != TranslationStatusCode::Success)
    {
        wcout << L"There was an error in translation, status: " << int(result->TranslationStatus) << '\n';
    }
    else
    {
        wcout << "We recognized in " << fromLanguage << ": " << result->Text << '\n';
        for (const auto& it : result->Translations)
        {
            wcout << L"    Translated into " << it.first.c_str() << ": " << it.second.c_str() << '\n';
        }
    }
}
// </TranslationWithMicrophone>

// Translation with file input.
// <TranslationWithFile>
void TranslationWithFile()
{
    // Creates an instance of a speech factory with specified
    // subscription key and service region. Replace with your own subscription key
    // and service region (e.g., "westus").
    auto factory = SpeechFactory::FromSubscription(L"YourSubscriptionKey", L"YourServiceRegion");

    // Sets source and target languages
    auto fromLanguage = L"en-US";
    vector<wstring> toLanguages{ L"de", L"fr" };

    // Creates a translation recognizer using file as audio input.
    // Replaces with your own audio file name.
    auto recognizer = factory->CreateTranslationRecognizerWithFileInput(L"YourAudioFile.wav", fromLanguage, toLanguages);

    // Starts translation. It returns when the first utterance has been recognized.
    auto result = recognizer->RecognizeAsync().get();

    // Checks result.
    if (result->Reason != Reason::Recognized)
    {
        wcout << L"There was an error in speech recognition, reason " << int(result->Reason) << L"-" << result->ErrorDetails << '\n';
    }
    else if (result->TranslationStatus != TranslationStatusCode::Success)
    {
        wcout << L"There was an error in translation, status: " << int(result->TranslationStatus) << '\n';
    }
    else
    {
        wcout << "We recognized in " << fromLanguage << ": " << result->Text << '\n';
        for (const auto& it : result->Translations)
        {
            wcout << L"    Translated into " << it.first.c_str() << ": " << it.second.c_str() << '\n';
        }
    }
}
// </TranslationWithFile>

// Defines event handlers for different events.
// <TranslationContinuousRecognitionUsingEvents>
static void OnPartialResult(const TranslationTextResultEventArgs& e)
{
    wcout << L"IntermediateResult: Recognized text:" << e.Result.Text << '\n';
    for (const auto& it : e.Result.Translations)
    {
        wcout << L"    Translated into " << it.first.c_str() << ": " << it.second.c_str() << '\n';
    }
}

static void OnFinalResult(const TranslationTextResultEventArgs& e)
{
    wcout << L"FinalResult: status:" << (int)e.Result.TranslationStatus << L". Recognized Text: " << e.Result.Text << '\n';
    for (const auto& it : e.Result.Translations)
    {
        wcout << L"    Translated into " << it.first.c_str() << ": " << it.second.c_str() << '\n';
    }
}

static void OnSynthesisResult(const TranslationSynthesisResultEventArgs& e)
{
    if (e.Result.SynthesisStatus == SynthesisStatusCode::Success)
    {
        wcout << L"Translation synthesis result: size of audio data: " << e.Result.Audio.size();
    }
    else if (e.Result.SynthesisStatus == SynthesisStatusCode::Error)
    {
        wcout << L"Translation synthesis error: " << e.Result.FailureReason;
    }
}

static void OnNoMatch(const TranslationTextResultEventArgs& e)
{
    wcout << L"NoMatch:" << (int)e.Result.Reason << '\n';
}

static void OnCanceled(const TranslationTextResultEventArgs& e)
{
    wcout << L"Canceled:" << (int)e.Result.Reason << L"- " << e.Result.Text << '\n';
}

// Continuous translation.
void TranslationContinuousRecognitionUsingEvents()
{
    // Creates an instance of a speech factory with specified
    // subscription key and service region. Replace with your own subscription key
    // and service region (e.g., "westus").
    auto factory = SpeechFactory::FromSubscription(L"YourSubscriptionKey", L"YourServiceRegion");

    // Sets source and target languages
    auto fromLanguage = L"en-US";
    vector<wstring> toLanguages{ L"de", L"fr" };

    // Creates a translation recognizer using microphone as audio input.
    auto recognizer = factory->CreateTranslationRecognizer(fromLanguage, toLanguages);

    // Subscribes to events.
    recognizer->IntermediateResult.Connect(&OnPartialResult);
    recognizer->FinalResult.Connect(&OnFinalResult);
    recognizer->Canceled.Connect(&OnCanceled);
    recognizer->NoMatch.Connect(&OnNoMatch);
    recognizer->TranslationSynthesisResultEvent.Connect(&OnSynthesisResult);

    wcout << L"Say something...\n";

    // Starts continuos recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
    recognizer->StartContinuousRecognitionAsync().wait();

    wcout << L"Press any key to stop\n";
    string s;
    getline(cin, s);

    // Stops recognition.
    recognizer->StopContinuousRecognitionAsync().wait();

    // Unsubscribes to events.
    recognizer->IntermediateResult.Disconnect(&OnPartialResult);
    recognizer->FinalResult.Disconnect(&OnFinalResult);
    recognizer->Canceled.Disconnect(&OnCanceled);
    recognizer->NoMatch.Disconnect(&OnNoMatch);
    recognizer->TranslationSynthesisResultEvent.Disconnect(&OnSynthesisResult);
}
// </TranslationContinuousRecognitionUsingEvents>
