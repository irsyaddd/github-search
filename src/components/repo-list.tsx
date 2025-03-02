"use client";

import { fetcher } from "@/app/page";
import useSWR from "swr";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  username?: string;
};

type Repo = {
  id: string;
  html_url: string;
  name: string;
};

export default function RepoList(props: Props) {
  const { data, error, isLoading } = useSWR(
    props.username
      ? `https://api.github.com/users/${props.username}/repos`
      : null,
    fetcher
  );

  if (error) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  const repo = data as Repo[];
  const fiveLatestRepo = repo.slice(0, 5);

  return (
    <div className="mt-6 space-y-2 space-x-2">
      {fiveLatestRepo.map((item) => (
        <Button key={item.id} variant={'outline'} size={'sm'} asChild>
          <Link href={item.html_url}>{item.name}</Link>
        </Button>
      ))}
    </div>
  );
}
