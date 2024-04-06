const TailInIcon = ({
  colour,
  className,
}: {
  colour?: string;
  className?: React.CSSProperties;
}) => {
  return (
    <svg
      viewBox="0 0 13 13"
      preserveAspectRatio="xMidYMid meet"
      version="1.1"
      x="0px"
      y="0px"
      enable-background="new 0 0 8 13"
      style={{
        ...className,
      }}
    >
      <title>tail-in</title>
      <path
        opacity="0.13"
        fill={colour}
        d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"
      ></path>
      <path
        fill={colour}
        d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"
      ></path>
    </svg>
  );
};

export default TailInIcon;
