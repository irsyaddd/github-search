"use client";

import RepoList from "@/components/repo-list";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useSWR from "swr";
import { useDebounceValue } from "usehooks-ts";

type GitHubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  hireable: boolean;
  bio: string;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

type ErrorResponse = {
  documentation_url: string;
  status: string;
  message: string;
};

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};

export default function Home() {
  const [username, setUsername] = useDebounceValue("", 700);
  const { data, error, isLoading } = useSWR(
    username ? `https://api.github.com/users/${username}` : null,
    fetcher,
    { shouldRetryOnError: false }
  );

  const user = data as GitHubUser;
  const TypedError = error as ErrorResponse;

  return (
    <div className="md:max-w-lg w-full px-12">
      <p>Github User Search</p>
      <Input
        type="text"
        placeholder="Username..."
        className="my-4"
        onChange={(e) => setUsername(e.target.value)}
      />
      <div
        className={cn(
          !isLoading && data ? "h-fit" : "h-80",
          "w-full border border-slate-200 shadow-sm rounded-md flex justify-between"
        )}
      >
        {!username && <p className="flex items-center justify-center w-full">Please input username</p>}
        {error && (
          <p className="flex items-center justify-center w-full">
            {TypedError.message}
          </p>
        )}
        {isLoading && (
          <p className="flex items-center justify-center w-full">Loading...</p>
        )}
        {!isLoading && data && (
          <div className="p-5">
            <div className="flex items-start gap-5">
              <Image
                src={user.avatar_url}
                alt="avatar"
                width={120}
                height={120}
                className="flex items-center justify-center aspect-square shrink-0 object-contain h-14 w-14 rounded-full"
              />
              <div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {user.bio}
                  </p>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground text-pretty mt-1">
                  <p>Followers: {user.followers}</p>
                  <p>Following: {user.following}</p>
                  <p>Public Repo: {user.public_repos}</p>
                </div>
              </div>
            </div>
            <RepoList username={username} />
          </div>
        )}
      </div>
    </div>
  );
}
