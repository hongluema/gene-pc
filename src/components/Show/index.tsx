export default function Show(props: {
  when: any;
  fallback?: any;
  children: React.ReactElement;
}) {
  const { when, fallback = null, children } = props;
  return when ? children : fallback;
}
