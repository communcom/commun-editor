// @flow
import styled from 'styled-components';

const Placeholder = styled.span.attrs({
  contentEditable: false,
  id: 'editor-placeholder',
})`
  pointer-events: none;
  display: inline-block;
  width: 0;
  max-width: 100%;
  white-space: nowrap;
  line-height: 1.2em;
  color: ${props => props.theme.placeholder};
  user-select: none;
`;

export default Placeholder;
