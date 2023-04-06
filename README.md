## outou

It seems like most QnA sites hide moderation behind a paywall, so I created outou to get around that limitation!

** Tech Stack 

Next.js, Firebase, Vercel. Pretty spartan tech stack, didn't want to overengineer outou. I also chose Firebase over Supabase due to the limitation Supabase has on their realtime listeners. Instead, onSnapshot() is used to get realtime updates. 
