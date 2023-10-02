import { useRouter } from "next/navigation";

export const navigateNowTo = (
  targetPage: string,
  router: ReturnType<typeof useRouter>
) => {
  router.push(targetPage);
};

export const navigateLaterTo = (
  targetPage: string,
  router: ReturnType<typeof useRouter>
) => {
  return () => {
    navigateNowTo(targetPage, router);
  };
};

export const replacePageUrlWith = (
  targetPage: string,
  router: ReturnType<typeof useRouter>
) => {
  router.replace(targetPage);
};

export const replacePageUrlWith404 = (router: ReturnType<typeof useRouter>) => {
  const targetPage = process.env.NEXT_PUBLIC_FRONTEND_404_URL || "/404";
  replacePageUrlWith(targetPage, router);
};
