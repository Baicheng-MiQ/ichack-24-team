from openai import OpenAI
import constants
client = OpenAI(api_key=constants.openai_api_key)

def give_summary(transcript):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
            "role": "system",
            "content": "You are a summary bot."
            },
            {
            "role": "user",
            "content": f"{transcript}"
            },
            {
            "role": "user",
            "content": "Here's everything I said during the day, conclude my day with bullet points. Start straight away from your first bullet point \"- \""
            },

        ],
        temperature=0.3,
        max_tokens=1081,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response

if __name__ == "__main__":
    print(give_summary("Hey Siri, play Welcome to New York. Now playing Welcome to New York by Taylor Swift. So it's been about two weeks since I moved into New York City, and the move-in process has been a little bit hectic. I shipped some packages from school, but some of the packages got lost during transit, which is really unfortunate, but there's nothing I can really do about it now. I'm actually staying in the same place that I was last summer. My friend Chewan was kind enough to let me sublet from him again, and I'm super lucky and grateful for that. Now this is the second time I'm here, I'm equipped with some knowledge from last year, and I'm ready to make the most out of my summer. But the main reason I'm in New York is actually because... Oops, sorry, give me a sec. There's this Chinese idiom, I think it goes. I don't know if this is scientifically backed up, but it basically means eat a hearty breakfast, a full lunch, and a small dinner. I just finished writing my planner, what I need to do for the day, and one very imperative task that I have is getting some toilet paper. I also need to send out some job applications, and if things go well, then I'll have a job after I graduate college. If things don't "))