const TailOut = ({
  colour,
  className,
}: {
  colour?: string;
  className?: React.CSSProperties;
}) => {
  return (
    <svg
      viewBox="0 0 8 13"
      preserveAspectRatio="xMidYMid meet"
      style={{
        ...className,
      }}
      version="1.1"
      x="0px"
      y="0px"
      enable-background="new 0 0 8 13"
    >
      <title>tail-out</title>
      <path
        fill={colour}
        opacity="0.13"
        d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
      ></path>
      <path
        fill={colour}
        d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
      ></path>
    </svg>
  );
};

export default TailOut
