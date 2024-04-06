const UnreadMessageIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      height="20"
      width="20"
      preserveAspectRatio="xMidYMid meet"
      version="1.1"
      x="0px"
      y="0px"
      enable-background="new 0 0 24 24"
      className={className}
    >
      <title>filter</title>
      <path
        d="M10,18.1h4v-2h-4V18.1z M3,6.1v2h18v-2H3z M6,13.1h12v-2H6V13.1z"
      ></path>
    </svg>
  );
};

export default UnreadMessageIcon;
